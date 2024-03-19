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
import emailjs from "@emailjs/browser";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, SkeletonText, Skeleton, Box, Switch } from '@chakra-ui/react'
import { useAuth } from "../hooks/useAuth";

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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [settings, setSettings] = useState<{ isCommentsOn: boolean, isPublic: boolean }>();
  const [imageLimitErrorMessage, setImageLimitErrorMessage] = useState<string>("");

  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure(); // Create new entry modal
  const { isOpen: isFinalOpen, onOpen: onFinalOpen, onClose: onFinalClose } = useDisclosure(); // Final image modal
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure(); // Delete project modal
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure(); // Project settings modal
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure(); // Report project modal
  const { isOpen: isReportSubmittedOpen, onOpen: onReportSubmittedOpen, onClose: onReportSubmittedClose } = useDisclosure(); // Report project submitted modal
  
  const inputImage = useRef(null); //User upload new entry photo
  const navigate = useNavigate();

  useEffect(() => {

    if (user?.user_name === username) setIsSameUser(true);

    async function fetchProjectAndEntries() {

      if (!isLoggedIn) {
        const resultUser = await autoLogin();
        if (resultUser?.user_name === username) setIsSameUser(true);
      };

      const parsedProjectId: number = parseInt(projectId!);
      const fetchProject = await fetch(`${process.env.API_URL}/projects/${parsedProjectId}`);
      const parsedProject: ProjectInterface = await fetchProject.json();
      setProject(parsedProject);
      setSettings({ isCommentsOn: parsedProject.isCommentsOn, isPublic: parsedProject.isPublic });

      const fetchProjectImg = await fetch(`${process.env.API_URL}/images/${parsedProject.img_id}`);
      const projectImg: Image = await fetchProjectImg.json();
      setProjectImage(projectImg);

      const fetchEntries = await fetch(`${process.env.API_URL}/entries/projects/${parsedProject.id}`);
      const entries = await fetchEntries.json();
      setEntries(entries);
      setIsLoaded(true);
    }

    async function fetchCurrentProjectUserId() {
      const fetchResult = await fetch(`${process.env.API_URL}/projects/${projectId}`);
      const currentProjectObj = await fetchResult.json();

      setCurrentProjectUserId(currentProjectObj.user_id);
    }

    fetchProjectAndEntries();
    fetchCurrentProjectUserId();
    // setIsLoaded(true);
  }, [])

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const imageToUpload = event.target.files![0];
    if (imageToUpload.size > 21000000) {
      setImageLimitErrorMessage("Image size cannot exceed 20MB. Please choose another one.")
      setNewEntryImage(null);
      return;
    } else {
      setImageLimitErrorMessage("");
    }
    console.log(imageToUpload.size);
    new Compressor(imageToUpload, {
      quality: 0.6,
      success(result: any) {
        setNewEntryImage(result);
      }
    })
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
    setImageLimitErrorMessage("");
    onNewClose();
  }

  async function handleDeleteOnClick() {
    const deleteBtnEl = document.getElementById("delete-project-btn") as HTMLButtonElement;
    deleteBtnEl.disabled = true;

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

    deleteBtnEl.disabled = false;
    navigate(`/${user?.user_name}`);
  }

  function handleSwitchOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => {
      const newSetting = Object.assign({}, prev);
      if (event.target.value === "comments")
        newSetting["isCommentsOn"] = !newSetting["isCommentsOn"];
      else
        newSetting["isPublic"] = !newSetting["isPublic"];

      try {
        fetch(`${process.env.API_URL}/projects/${projectId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSetting)
        });
      } catch (e) {
        console.log(e);
      }

      return newSetting;
    });
  }

  async function handleReportOnClick() {
    const reportBtnEl = document.getElementById("report-project-btn") as HTMLButtonElement;
    reportBtnEl.disabled = true;

    emailjs.init(process.env.EMAIL_PUBLIC_KEY!);
    const serviceId = process.env.EMAIL_SERVICE_ID!;
    const templateId = process.env.EMAIL_TEMPLATE_ID!;
    // const siteKey = process.env.EMAIL_SITE_KEY!; TESTING CAPTCHA
    const reason = document.getElementById("report-project") as HTMLTextAreaElement;

    // grecaptcha.ready(function () {
    //   grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
    try {
      await emailjs.send(serviceId, templateId, {
        project_id: project!.id,
        report_reason: reason.value
      });
    } catch (error) {
      console.log(error);
    }
    reportBtnEl.disabled = false;
    onReportClose();
    onReportSubmittedOpen();
    //   });
    // });

  }

  return (
    isLoaded ? <>
      {isLoggedIn ? <LoggedInHeader /> : <LoggedOutHeader />}
      <section className="project-container">
        <Link to={`/${username}`} className="project-back-btn">← Back</Link>
        <div className="project-description-container">
          <img src={projectImage?.url} alt="project photo" className="project-photo" onClick={onFinalOpen} />
          {isProjectEditable 
          ? 
          <EditableProjectDescription project={project} setProject={setProject} setProjectImage={setProjectImage} setIsProjectEditable={setIsProjectEditable} /> 
          : 
          <ProjectDescription project={project} isSameUser={isSameUser} setIsProjectEditable={setIsProjectEditable} onSettingsOpen={onSettingsOpen} />}

        </div>
        {isSameUser ? <button onClick={onNewOpen} className="create-entry-btn">+ Create new entry</button> : null}
        {entries?.map((entry) => (
          <Entry entry={entry} key={entry.id} isSameUser={isSameUser} setEntries={setEntries} isCommentsOn={project?.isCommentsOn} />
        ))}
        <div className="delete-project-container">
          {isSameUser ? <button className="delete-project-btn" onClick={onDeleteOpen}>Delete project ✕</button> : null}
          {isSameUser ? null : <button className="delete-project-btn" onClick={onReportOpen}>Report project</button>}
        </div>
      </section>

      <Modal isOpen={isNewOpen} onClose={onNewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new entry</ModalHeader>
          <ModalCloseButton className="modal-close-btn" />
          <ModalBody>
            <p className="margin-bottom">Entry image (optional):</p>
            <input id="new-entry-img" type="file" className="margin-bottom" ref={inputImage} onChange={handleChange} accept="image/*" />
            <p className="error-message">{imageLimitErrorMessage}</p>
            <p className="margin-bottom">Entry description: </p>
            <textarea id="input-new-description" className="input-new-description" value={newEntryDescription} onChange={(e) => setNewEntryDescription(e.target.value)} autoFocus></textarea>
          </ModalBody>
          <ModalFooter className="modal-footer">
            <div className="btn-container">
              <button id="new-entry-cancel-btn" className="modal-btn cancel-btn" onClick={() => {onNewClose(); setImageLimitErrorMessage("");}}>
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
              <button className="modal-btn cancel-btn" onClick={onDeleteClose}>Cancel</button>
              <button className="modal-btn" id="delete-project-btn" onClick={handleDeleteOnClick}>Delete</button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginTop="0.5em">Settings</ModalHeader>
          <ModalCloseButton margin="0.5em 0.5em" />
          <ModalBody>
            <form>
              <div className="switch-container">
                <label htmlFor="project-comments">Comments</label>
                <Switch id="project-comments" onChange={handleSwitchOnChange} value="comments" isChecked={settings?.isCommentsOn} />
              </div>
              <div className="switch-container">
                <label htmlFor="project-public">Public</label>
                <Switch id="project-public" onChange={handleSwitchOnChange} value="public" isChecked={settings?.isPublic} />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isReportOpen} onClose={onReportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginTop="0.5em">Report this project?</ModalHeader>
          <ModalCloseButton margin="0.5em 0.5em" />
          <ModalBody>
            <p>Let us know why you would like to report this project:</p>
            <textarea name="report-project" id="report-project" autoFocus></textarea>
          </ModalBody>
          <ModalFooter>
            <div className="btn-container">
              <button className="modal-btn cancel-btn" onClick={onReportClose}>Cancel</button>
              <button id="report-project-btn" className="modal-btn" onClick={handleReportOnClick}>Report</button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isReportSubmittedOpen} onClose={onReportSubmittedClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginTop="0.5em">Project reported</ModalHeader>
          <ModalCloseButton margin="0.5em 0.5em" />
          <ModalBody>
            <p>The project has been reported and our team will investigate this issue as soon as possible! Thank you for your time and consideration.</p>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </> :
      <>
        {isLoggedIn ? <LoggedInHeader /> : <LoggedOutHeader />}
        <Box className="project-container">
          <Box className="project-description-container">
            <Skeleton className="project-photo skeleton-photo" />
            <Box className="skeleton-box">
              <Skeleton className="skeleton-project-title" />
              <SkeletonText className="skeleton-project-description" marginTop="1em" />
            </Box>
          </Box>
        </Box >
      </>
  )
};

export default Project;