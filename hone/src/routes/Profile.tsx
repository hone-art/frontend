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

const Profile: FC<Props> = ({ user, isLoggedIn }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Array<Project>>([]);
  const { username } = useParams<string>();
  const [userProfile, setUserProfile] = useState<User | null>(null); // User of profile that is shown
  const [isUser, setIsUser] = useState<boolean>(false); // Is logged in user and user profile the same
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [newDisplayName, setNewDisplayName] = useState<string>("");
  const [newProfilePicture, setNewProfilePicture] = useState<File>();

  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal

  const inputImage = useRef(null); // User upload profile picture

  useEffect(() => {
    const body = { user_name: username }; // CHANGE


    async function fetchUserAndProjects() {
      const fetchUser = await fetch("http://localhost:8080/users/username", {
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
        const fetchPicture = await fetch(`http://localhost:8080/images/${thisProfileUser.img_id}`);
        const setPicture = await fetchPicture.json();
        setProfilePicture(setPicture.url);

        setUserProfile(thisProfileUser);

        if (user?.user_name === thisProfileUser?.user_name) setIsUser(true);

        try {
          const fetchProjects = await fetch(`http://localhost:8080/projects/users/${thisProfileUser?.id}`);
          const projects = await fetchProjects.json();
          setProjects(projects);
          console.log(projects);
        }
        catch (e) {
          console.log(e);
        }
      }
    }

    fetchUserAndProjects();
    // const thisProfileUser = fetch("/users/username/{username}");
    // setUserProfile(thisProfileUser);
    // if (userProfile.username == user.username) setIsUser(true);
    // if img_id != null
    // const fetchProfilePic = fetch("/images/{userProfile.img_id}")
    // setProfilePicture(fetchProfilePic)
    // if user.display_name == null, set it to the username
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) { // Upload image
    const imageToUpload = event.target.files![0];
    setNewProfilePicture(imageToUpload);
    console.log(imageToUpload);
  }

  async function handleEditOnClick() {
    if (newProfilePicture) {
      const storageRef = ref(storage, `${newProfilePicture.name}`);
      const snapshot = await uploadBytes(storageRef, newProfilePicture);

      const imgUrl = await getDownloadURL(snapshot.ref);

      const newPhotoBody = { url: imgUrl };
      const fetchNewPhoto = await fetch("http://localhost:8080/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPhotoBody),
      });

      const newPhoto = await fetchNewPhoto.json();
      setProfilePicture(newPhoto.url);

      const updateUserBody = { img_id: newPhoto.id };
      const fetchUpdatedUser = await fetch(`http://localhost:8080/users/${userProfile?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUserBody),
      });

      const updatedUser = await fetchUpdatedUser.json();
      setUserProfile(updatedUser);
    }

    // const fetchNewDisplayName = fetch("http://localhost")
    // upload photo to bucket, get external link
    // const newImage = fetch("images") POST new image link
    // fetch("/users") PATCH request to edit display name and image_id
    // setProfilePicture to new link
    onClose();
  }

  function handleNewProjectOnClick() {
    const body = {
      title: "Untitled",
      description: "Write your description here!",
      img_id: 2, // default project image
      user_id: user?.id,
    }

    fetch("http://localhost:8080/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
  }

  return (
    <>
      {/* <LoggedInHeader user={user} /> */}
      {isLoggedIn ? <LoggedInHeader user={user} /> : <LoggedOutHeader />}
      <section className="profile-container">
        <div className="profile-card">
          <img src={profilePicture} alt="profile picture" className="profile-picture" />
          <h1 id="display-name">{userProfile?.display_name}</h1>
          {/* <h1 id="display-name">Yurika</h1> */}
          <h2 id="username">@{userProfile?.user_name}</h2>
          {/* <h2 id="username">@yurikahirata</h2> */}
          {/* {isLoggedIn ? <button className="edit-profile-btn">Edit profile</button> : null} */}
          <button className="edit-profile-btn" onClick={onOpen}>Edit profile</button>
          {/* {isUser ? <button className="edit-profile-btn" onClick={onOpen}>Edit profile</button> : null} */}
        </div>
        <div className="projects-container">
          {isUser ? <button className="new-project-btn" onClick={handleNewProjectOnClick}>+ Create new project</button> : null}
          <div className="project-cards-container">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} userProfile={userProfile} />
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
            <input type="file" className="margin-bottom" ref={inputImage} onChange={handleChange} accept="image/*" />
            <p className="margin-bottom">Display name: </p>
            <input type="text" className="input-name" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} />
          </ModalBody>

          <ModalFooter className="modal-footer">
            <div className="btn-container">
              <button className="modal-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-btn" onClick={handleEditOnClick}>Edit</button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};

export default Profile;