import { FC, useState, useEffect, useRef } from "react";
import { User, Project } from "../globals";
import "../styles/profile.css";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";
import ProjectCard from "../components/ProjectCard";
// import { useParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Heatmap from '../components/Heatmap';
import Streaks from '../components/Streaks';
import Compressor from 'compressorjs';


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SkeletonCircle,
  Skeleton,
  Box,
  Switch
} from '@chakra-ui/react'
import { useAuth } from "../hooks/useAuth";

// type Props = {
//   user: User | null;
//   setUser: (initialState: User | (() => User | null) | null) => void;
//   isLoggedIn: boolean;
// }

// const Profile: FC<Props> = ({ user, setUser, isLoggedIn }) => {
const Profile: FC = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn, autoLogin } = useAuth();
  const { username } = useParams<string>();

  const [projects, setProjects] = useState<Array<Project>>([]);
  const [userProfile, setUserProfile] = useState<User | null>(null); // User of profile that is shown
  const [isUser, setIsUser] = useState<boolean>(false); // Is logged in user and user profile the same
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [newDisplayName, setNewDisplayName] = useState<string>("");
  const [newProfilePicture, setNewProfilePicture] = useState<File>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [thisProfileUserState, setThisProfileUserState] = useState<User>();
  const [imageLimitErrorMessage, setImageLimitErrorMessage] = useState<string>("");
  const [isInspiring, setIsInspiring] = useState<boolean>(false);

  const { isOpen, onOpen: originalOnOpen, onClose: originalOnClose } = useDisclosure(); // Modal
  const onOpen = () => {
    setImageLimitErrorMessage('');
    originalOnOpen();
  }
  const onClose = () => {
    setImageLimitErrorMessage('');
    originalOnClose();
  }

  const inputImage = useRef(null); // User upload profile picture

  useEffect(() => {
    if (user?.user_name === username) {
      setIsUser(true);
    }

    async function fetchUserAndProjects() {
      const body = { user_name: username };
      if (!isLoggedIn) {
        const resultUser = await autoLogin();
        if (resultUser?.user_name === username) setIsUser(true);
      };

      const fetchUser = await fetch(`${process.env.API_URL}/users/username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (fetchUser.status !== 200) {
        navigate("/")
      }
      else {
        const thisProfileUser: User = await fetchUser.json();
        setThisProfileUserState(thisProfileUser);
        setIsInspiring(thisProfileUser.isInspiring);
        setNewDisplayName(thisProfileUser.display_name);

        const fetchPicture = await fetch(`${process.env.API_URL}/images/${thisProfileUser.img_id}`);
        const setPicture = await fetchPicture.json();

        setProfilePicture(setPicture.url);
        setUserProfile(thisProfileUser);


        try {
          if (isUser) {
            const fetchProjects = await fetch(`${process.env.API_URL}/projects/users/${thisProfileUser?.id}`);
            const allProjects = await fetchProjects.json();
            setProjects(allProjects);
          } else {
            const fetchPublicProjects = await fetch(`${process.env.API_URL}/projects/users/${thisProfileUser?.id}/isPublic`);
            const publicProjects = await fetchPublicProjects.json();
            setProjects(publicProjects);
          }
        }
        catch (e) {
          console.log(e);
        }
      }
      setIsLoaded(true);
    }

    fetchUserAndProjects();
  }, [user, isUser, username, isLoaded])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) { // Upload image
    const imageToUpload = event.target.files![0];
    if (imageToUpload.size > 21000000) {
      setImageLimitErrorMessage("Image size cannot exceed 20MB. Please choose another one.")
      setNewProfilePicture(undefined);
      return;
    } else {
      setImageLimitErrorMessage("");
    }
    new Compressor(imageToUpload, {
      quality: 0.6,
      success(result: any) {
        setNewProfilePicture(result);
      }
    })
  }

  async function handleEditOnClick() {
    const cancelButtonEl = document.getElementById("profile-cancel-btn") as HTMLButtonElement;
    cancelButtonEl.disabled = true;

    const saveButtonEl = document.getElementById("profile-save-btn") as HTMLButtonElement;
    saveButtonEl.disabled = true;

    const picInputEl = document.getElementById("profile-pic-input") as HTMLInputElement;
    picInputEl.disabled = true;

    const nameInputEl = document.getElementById("display-name-input") as HTMLInputElement;
    nameInputEl.disabled = true;

    if (newProfilePicture) {
      const storageRef = ref(storage, `${newProfilePicture.name}`);
      const snapshot = await uploadBytes(storageRef, newProfilePicture);
      const imgUrl = await getDownloadURL(snapshot.ref);

      const newPhotoBody = { url: imgUrl, filePath: newProfilePicture.name };
      const fetchNewPhoto = await fetch(`${process.env.API_URL}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPhotoBody),
      });

      const newPhoto = await fetchNewPhoto.json();

      setProfilePicture(newPhoto.url);

      const updateUserBody = { img_id: newPhoto.id };
      const fetchUpdatedUser = await fetch(`${process.env.API_URL}/users/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUserBody),
      });

      const updatedUser = await fetchUpdatedUser.json();

      setUserProfile(updatedUser);
      setUser(updatedUser);
    }

    if (newDisplayName !== userProfile?.display_name) {
      const updateUserBody = { display_name: newDisplayName };
      const fetchUpdatedUser = await fetch(`${process.env.API_URL}/users/${userProfile?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUserBody),
      });

      const updatedUser = await fetchUpdatedUser.json();
      setUserProfile(updatedUser);
      setUser(updatedUser);
    }

    cancelButtonEl.disabled = false;
    saveButtonEl.disabled = false;
    picInputEl.disabled = false;
    nameInputEl.disabled = false;
    onClose();
  }

  async function handleNewProjectOnClick() {
    const body = {
      title: "Untitled",
      description: "",
      img_id: 2, // default project image
      user_id: userProfile?.id, //Change to user
      isPublic: true,
      isCommentsOn: true,
    }

    const fetchNewProject = await fetch(`${process.env.API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    const newProject = await fetchNewProject.json();
    navigate(`/${userProfile?.user_name}/projects/${newProject.id}`); // Change to user
  }

  async function handleSwitchOnChange() {
    setIsInspiring((prev) => {
      const newBool = !prev;

      const body = { isInspiring: newBool };
      fetch(`${process.env.API_URL}/users/${user!.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      return newBool;
    });
  }

  return (
    isLoaded ? <>
      {isLoggedIn ? <LoggedInHeader /> : <LoggedOutHeader />}
      <section className="profile-container">
        <div className="profile-card">
          <img src={profilePicture} alt="profile picture" className="profile-picture" />
          <h1 id="display-name">{userProfile?.display_name}</h1>
          <h2 id="username">@{userProfile?.user_name}</h2>
          {isUser ? <button className="edit-profile-btn" onClick={onOpen}>Edit profile</button> : null}
          <Heatmap isUser={isUser} thisProfileUser={thisProfileUserState}></Heatmap>
          <Streaks thisProfileUser={thisProfileUserState}></Streaks>
        </div>
        <div className="projects-container">
          {isUser ? <button className="new-project-btn" onClick={handleNewProjectOnClick}>+ Create new project</button> : null}
          <div className="project-cards-container">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} userProfile={userProfile} isUser={isUser} />
            ))}
          </div>
        </div>
      </section>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit profile</ModalHeader>
          <ModalCloseButton className="modal-close-btn" />
          <ModalBody>
            <h2 className="margin-bottom">Profile picture:</h2>
            <input id="profile-pic-input" type="file" ref={inputImage} onChange={handleChange} accept="image/*" />
            <p className="error-message">{imageLimitErrorMessage}</p>
            <p className="margin-top margin-bottom">Display name: </p>
            <input id="display-name-input" type="text" className="input-name" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} />
            <div className="margin-top  margin-bottom space-between">
              <label htmlFor="inspiring-switch">Inspiration page</label>
              <Switch id="inspiring-switch" onChange={handleSwitchOnChange} value="inspiring" isChecked={isInspiring} />
            </div>
            <p className="inspiring-warning">Turning this on will make it so your public projects and entries may appear in our community inspiration page</p>
          </ModalBody>

          <ModalFooter className="modal-footer">
            <div className="btn-container">
              <button id="profile-cancel-btn" className="modal-btn cancel-btn" onClick={onClose}>Cancel</button>
              <button id="profile-save-btn" className="modal-btn" onClick={handleEditOnClick}>Save</button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </> :
      <>
        {isLoggedIn ? <LoggedInHeader /> : <LoggedOutHeader />}
        <Box className="profile-container">
          <Box className="skeleton-profile-card">
            <SkeletonCircle className="profile-picture" width="60%" height="inherit" alignSelf="center" />
            <Skeleton className="skeleton-display-name" />
            <Skeleton className="skeleton-display-name" />
            <Skeleton className="skeleton-heat-map" />
          </Box>
          <Box className="projects-container">
            <Box className="project-cards-container">
              <Skeleton className="skeleton-project" />
              <Skeleton className="skeleton-project" />
              <Skeleton className="skeleton-project" />
              <Skeleton className="skeleton-project" />
            </Box>
          </Box>
        </Box >

      </>
  )
};

export default Profile;