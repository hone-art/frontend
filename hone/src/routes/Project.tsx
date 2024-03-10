import { FC, useState, useEffect, useRef } from "react";
import "../styles/project.css"
import { useParams, Link } from "react-router-dom";
import { User, Image } from '../globals';
import { Project as ProjectInterface, Entry as EntryInterface } from "../globals";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";
import ProjectDescription from "../components/ProjectDescription";
import EditableProjectDescription from "../components/EditableProjectDescription";
import Entry from "../components/Entry";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
// import { parse } from "dotenv";

// const BACKEND_URL = 'https://hone-backend-6c69d7cab717.herokuapp.com';
const BACKEND_URL = 'http://localhost:8080';

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


type Props = {
  user: User | null;
  isLoggedIn: boolean;
}

const Project: FC<Props> = ({ user, isLoggedIn }) => {
  const { username, projectId } = useParams<string>();
  const [project, setProject] = useState<ProjectInterface>();
  const [isSameUser, setIsSameUser] = useState<boolean>(false);
  const [projectImageURL, setProjectImageURL] = useState<string>("");
  const [isProjectEditable, setIsProjectEditable] = useState<boolean>(false);
  const [entries, setEntries] = useState<Array<EntryInterface>>();
  const [newEntryImage, setNewEntryImage] = useState<File>();
  const [newEntryImageId, setNewEntryImageId] = useState<string>("");
  const [newEntryDescription, setNewEntryDescription] = useState<string>("");
  const [currentProjectUserId, setCurrentProjectUserId] = useState<number>();

  const { isOpen, onOpen, onClose } = useDisclosure(); //Modal

  const inputImage = useRef(null); //User upload new entry photo

  useEffect(() => {
    if (user?.user_name === username) setIsSameUser(true);

    async function fetchProjectAndEntries() {
      const parsedProjectId: number = parseInt(projectId!);
      const fetchProject = await fetch(`${BACKEND_URL}/projects/${parsedProjectId}`);
      const parsedProject: ProjectInterface = await fetchProject.json();
      setProject(parsedProject);

      const fetchProjectImg = await fetch(`${BACKEND_URL}/images/${parsedProject.img_id}`);
      const projectImg: Image = await fetchProjectImg.json();
      setProjectImageURL(projectImg.url);

      const fetchEntries = await fetch(`${BACKEND_URL}/entries/projects/${parsedProject.id}`);
      const entries = await fetchEntries.json();
      setEntries(entries);
    }

    async function fetchCurrentProjectUserId() {
      const fetchResult = await fetch(`${BACKEND_URL}/projects/${projectId}`);
      const currentProjectObj = await fetchResult.json();
      setCurrentProjectUserId(currentProjectObj.user_id);
    }

    fetchProjectAndEntries();
    fetchCurrentProjectUserId();
  }, [])


  async function handleOnClick() {
    const newEntryBody = { description: "Write a description here!", project_id: project?.id, user_id: user?.id };
    // post request to create new entry
    // setEntries((prev) => {
    //   const newEntries = [...prev];
    //   newEntries.push(newEntry);
    //   return newEntries;
    // })
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const imageToUpload = event.target.files![0];
    setNewEntryImage(imageToUpload);
    console.log(imageToUpload);
  }

  async function handleCreateNewEntry() {
    if (newEntryImage) {
      const storageRef = ref(storage, `${newEntryImage.name}`);
      const snapshot = await uploadBytes(storageRef, newEntryImage);
      const imgUrl = await getDownloadURL(snapshot.ref);

      const newImageBody = {url: imgUrl};
      const fetchNewEntryImage = await fetch(`${BACKEND_URL}/images`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newImageBody)
      });

      const newImage = await fetchNewEntryImage.json();
      setNewEntryImageId(newImage.id);
    }

    const newEntryBody = {
      description: newEntryDescription, 
      img_id: newEntryImageId,
      project_id: Number(projectId),
      user_id: currentProjectUserId
    }
    const createNewEntryResponse = await fetch(`${BACKEND_URL}/entries/`, {
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify(newEntryBody),
    })
    onClose();
  }

  return (
    <>
      {isLoggedIn ? <LoggedInHeader user={user} /> : <LoggedOutHeader />}
      <section className="project-container">
        <Link to={`/${username}`}>← Back</Link>
        {isProjectEditable ? <EditableProjectDescription project={project} setProject={setProject} projectImageURL={projectImageURL} setProjectImageURL={setProjectImageURL} setIsProjectEditable={setIsProjectEditable} /> : <ProjectDescription project={project} projectImageURL={projectImageURL} isSameUser={isSameUser} setIsProjectEditable={setIsProjectEditable} />}
        {isSameUser ? <button onClick={onOpen}>+ Create new entry</button> : null}
        {entries?.map((entry) => (
          <Entry entry={entry} key={entry.id} isSameUser={isSameUser} />
        ))}
      </section>
      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create new entry</ModalHeader>
            <ModalCloseButton className="modal-close-btn" />
            <ModalBody>
              <p className="margin-bottom">Entry image:</p>
              <input type="file" className="margin-bottom" ref={inputImage} onChange={handleChange} accept="image/*" />
              <p className="margin-bottom">Entry description: </p>
              <input type="text" className="input-name" value={newEntryDescription} onChange={(e) => setNewEntryDescription(e.target.value)} />
            </ModalBody>

            <ModalFooter className="modal-footer">
            <div className="btn-container">
              <button className="modal-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-btn" onClick={handleCreateNewEntry}>Create</button>
            </div>
          </ModalFooter>
          </ModalContent>
      </Modal>
    </>
  )
};

export default Project;