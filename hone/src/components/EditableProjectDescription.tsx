import { FC, useState, Dispatch, useRef } from "react";
import { Project } from "../globals";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import "../styles/project.css";

type Props = {
  project: Project | undefined;
  setIsProjectEditable: Dispatch<React.SetStateAction<boolean>>;
  setProject: Dispatch<React.SetStateAction<Project | undefined>>;
  setProjectImageURL: Dispatch<React.SetStateAction<string>>;
}

const EditableProjectDescription: FC<Props> = ({ project, setProject, setProjectImageURL, setIsProjectEditable }) => {
  const [newProjectTitle, setNewProjectTitle] = useState<string | undefined>(project?.title);
  const [newProjectDescription, setNewProjectDescription] = useState<string | undefined>(project?.description);
  const [newProjectPicture, setnewProjectPicture] = useState<File | null>(null);

  const inputImage = useRef(null); // User upload profile picture

  async function handleOnClick() {
    const updateProjectBody = { title: newProjectTitle, description: newProjectDescription }
    const fetchUpdatedProject = await fetch(`http://localhost:8080/projects/${project?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProjectBody),
    });
    const updatedProject = await fetchUpdatedProject.json();
    setProject(updatedProject);

    if (newProjectPicture !== null) { // Upload and update project img if not empty
      const storageRef = ref(storage, `${newProjectPicture.name}`);
      const snapshot = await uploadBytes(storageRef, newProjectPicture);
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
      setProjectImageURL(newPhoto.url);

      const updateProjectBody = { img_id: newPhoto.id };
      const fetchUpdatedProject = await fetch(`http://localhost:8080/projects/${project?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateProjectBody),
      });

      const updatedProject = await fetchUpdatedProject.json();
      setProject(updatedProject);
      setnewProjectPicture(null);
    }

    setIsProjectEditable(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) { // Upload image
    const imageToUpload = event.target.files![0];
    setnewProjectPicture(imageToUpload);
  }

  return (
    <>
      <div className="title-description-container">
        <div className="project-title-btn-container">
          <input type="text" className="project-page-title editable-title" value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} />
        </div>
        <textarea className="editable-description" value={newProjectDescription} onChange={(e) => setNewProjectDescription(e.target.value)} autoFocus />
        <div className="project-upload-submit-container">
          <input type="file" ref={inputImage} onChange={handleChange} accept="image/*" />
          <button className="edit-project-submit-btn" onClick={handleOnClick}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default EditableProjectDescription;