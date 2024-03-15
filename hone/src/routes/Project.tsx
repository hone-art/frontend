import { FC, useState, useEffect, useRef } from "react";
import "../styles/project.css"
import { useParams, Link, useNavigate } from "react-router-dom";
// import { User, Image } from '../globals';
import { Image } from '../globals';
import { Project as ProjectInterface, Entry as EntryInterface } from "../globals";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";
import ProjectDescription from "../components/ProjectDescription";
import EditableProjectDescription from "../components/EditableProjectDescription";
import Entry from "../components/Entry";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes, getStorage, deleteObject } from "firebase/storage";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { useAuth } from "../hooks/useAuth";


// type Props = {
//   user: User | null;
//   isLoggedIn: boolean;
// }

// const Project: FC<Props> = ({ user, isLoggedIn }) => {
const Project: FC = () => {
  const { username, projectId } = useParams<string>();
  const { user, isLoggedIn, autoLogin } = useAuth();
  const [project, setProject] = useState<ProjectInterface>();
  const [isSameUser, setIsSameUser] = useState<boolean>(false);
  const [projectImage, setProjectImage] = useState<Image>();
  const [isProjectEditable, setIsProjectEditable] = useState<boolean>(false);
  const [entries, setEntries] = useState<Array<EntryInterface>>();
  const [newEntryImage, setNewEntryImage] = useState<File | null>(null);
  const [newEntryDescription, setNewEntryDescription] = useState<string>("");
  const [currentProjectUserId, setCurrentProjectUserId] = useState<number>();

  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure(); // Create new entry modal
  const { isOpen: isFinalOpen, onOpen: onFinalOpen, onClose: onFinalClose } = useDisclosure(); // Final image modal
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure(); // Delete project modal

  const inputImage = useRef(null); //User upload new entry photo
  const navigate = useNavigate();

  useEffect(() => {

    if (user?.user_name === username) setIsSameUser(true);

    async function fetchProjectAndEntries() {

      if (!isLoggedIn) {
        console.log("AUTO LOGIN");
        const resultUser = await autoLogin();
        if (resultUser?.user_name === username) setIsSameUser(true);
      };

      const parsedProjectId: number = parseInt(projectId!);
      const fetchProject = await fetch(`${process.env.API_URL}/projects/${parsedProjectId}`);
      const parsedProject: ProjectInterface = await fetchProject.json();
      setProject(parsedProject);

      const fetchProjectImg = await fetch(`${process.env.API_URL}/images/${parsedProject.img_id}`);
      const projectImg: Image = await fetchProjectImg.json();
      setProjectImage(projectImg);

      const fetchEntries = await fetch(`${process.env.API_URL}/entries/projects/${parsedProject.id}`);
      const entries = await fetchEntries.json();
      setEntries(entries);
    }

    async function fetchCurrentProjectUserId() {
      const fetchResult = await fetch(`${process.env.API_URL}/projects/${projectId}`);
      const currentProjectObj = await fetchResult.json();

      setCurrentProjectUserId(currentProjectObj.user_id);
    }

    fetchProjectAndEntries();
    fetchCurrentProjectUserId();
  }, [])

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const imageToUpload = event.target.files![0];

    setNewEntryImage(imageToUpload);
  }

  async function handleCreateNewEntry() {
    let newImageId = null;

    const uploadInputEl = document.getElementById("new-entry-img") as HTMLInputElement;
    uploadInputEl.disabled = true;

    const descriptionInputEl = document.getElementById("input-new-description") as HTMLInputElement;
    descriptionInputEl.disabled = true;

    const cancelButtonEl = document.getElementById("new-entry-cancel-btn") as HTMLButtonElement;
    cancelButtonEl.disabled = true;

    const createButtonEl = document.getElementById("new-entry-create-btn") as HTMLButtonElement;
    createButtonEl.disabled = true;

    if (newEntryImage !== null) {
      const storageRef = ref(storage, `${newEntryImage.name}`);
      const snapshot = await uploadBytes(storageRef, newEntryImage);
      const imgUrl = await getDownloadURL(snapshot.ref);

      const newImageBody = { url: imgUrl, filePath: newEntryImage.name };
      const fetchNewEntryImage = await fetch(`${process.env.API_URL}/images`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newImageBody)
      });

      const newImage = await fetchNewEntryImage.json();
      newImageId = newImage.id;
    }

    const newProjectId = parseInt(projectId!);
    const newEntryBody = {
      description: newEntryDescription,
      img_id: newImageId,
      project_id: newProjectId,
      user_id: currentProjectUserId
    }

    const createNewEntryResponse = await fetch(`${process.env.API_URL}/entries/`, {
      method: 'POST',
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(newEntryBody),
    })

    const newEntry = await createNewEntryResponse.json();

    setEntries((prev) => {
      const newArray = prev?.slice();
      newArray?.unshift(newEntry);
      return newArray;
    })

    uploadInputEl.disabled = false;
    descriptionInputEl.disabled = false;
    cancelButtonEl.disabled = false;
    createButtonEl.disabled = false;
    setNewEntryDescription("");
    setNewEntryImage(null);
    onNewClose();
  }

  async function handleDeleteOnClick() {
    await fetch(`${process.env.API_URL}/projects/${project!.id}`, {
      method: "DELETE",
    });

    if (projectImage?.id !== 1 && projectImage?.id !== 2) {
      await fetch(`${process.env.API_URL}/images/${projectImage?.id}`, {
        method: "DELETE",
      });

      const storage = getStorage();
      const deleteRef = ref(storage, projectImage?.filePath);
      deleteObject(deleteRef);
    }

    navigate(`/${user?.user_name}`);
  }

  return (
    <>
      {isLoggedIn ? <LoggedInHeader /> : <LoggedOutHeader />}
      <section className="project-container">
        <Link to={`/${username}`} className="project-back-btn">← Back</Link>
        <div className="project-description-container">
          <img src={projectImage?.url} alt="project photo" className="project-photo" onClick={onFinalOpen} />
          {isProjectEditable ? <EditableProjectDescription project={project} setProject={setProject} setProjectImage={setProjectImage} setIsProjectEditable={setIsProjectEditable} /> : <ProjectDescription project={project} isSameUser={isSameUser} setIsProjectEditable={setIsProjectEditable} />}

        </div>
        {isSameUser ? <button onClick={onNewOpen} className="create-entry-btn">+ Create new entry</button> : null}
        {entries?.map((entry) => (
          <Entry entry={entry} key={entry.id} isSameUser={isSameUser} setEntries={setEntries} isCommentsOn={project?.isCommentsOn} />
        ))}
        <div className="delete-project-container">
          {isSameUser ? <button className="delete-project-btn" onClick={onDeleteOpen}>Delete project ✕</button> : null}
        </div>
      </section>
      <Modal isOpen={isNewOpen} onClose={onNewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new entry</ModalHeader>
          <ModalCloseButton className="modal-close-btn" />
          <ModalBody>
            <p className="margin-bottom">Entry image:</p>
            <input id="new-entry-img" type="file" className="margin-bottom" ref={inputImage} onChange={handleChange} accept="image/*" />
            <p className="margin-bottom">Entry description: </p>
            <textarea id="input-new-description" className="input-new-description" value={newEntryDescription} onChange={(e) => setNewEntryDescription(e.target.value)} autoFocus></textarea>
            {/* <input type="text" className="input-new-description" value={newEntryDescription} onChange={(e) => setNewEntryDescription(e.target.value)} /> */}
          </ModalBody>

          <ModalFooter className="modal-footer">
            <div className="btn-container">
              <button id="new-entry-cancel-btn" className="modal-btn" onClick={onNewClose}>
                Cancel
              </button>
              <button id="new-entry-create-btn" className="modal-btn" onClick={handleCreateNewEntry}>Create</button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isFinalOpen} onClose={onFinalClose}>
        <ModalOverlay />
        <ModalContent maxH="90vh" maxW="90vw" color="transparent" bg="transparent" alignItems="center" boxShadow="none">
          <ModalCloseButton margin="0" boxShadow="none" bg="white" outline="transparent" />
          <ModalBody>
            <img src={projectImage?.url} className="entry-img-full" />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginTop="0.5em">Are you sure you want to delete this project?</ModalHeader>
          <ModalCloseButton margin="0.5em 0.5em" />
          <ModalBody>
            This action cannot be undone!
          </ModalBody>
          <ModalFooter>
            <div className="btn-container">
              <button className="modal-btn" onClick={onDeleteClose}>Cancel</button>
              <button className="modal-btn" onClick={handleDeleteOnClick}>Delete</button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};

export default Project;