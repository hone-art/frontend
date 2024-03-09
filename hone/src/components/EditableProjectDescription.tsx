import { FC, useState, Dispatch, useRef } from "react";
import { Project } from "../globals";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import "../styles/project.css";

type Props = {
  project: Project | undefined;
  projectImageURL: string;
  setIsProjectEditable: Dispatch<React.SetStateAction<boolean>>;
  setProject: Dispatch<React.SetStateAction<Project | undefined>>;
  setProjectImageURL: Dispatch<React.SetStateAction<string>>;
}

const EditableProjectDescription: FC<Props> = ({ project, setProject, projectImageURL, setProjectImageURL, setIsProjectEditable }) => {
  const [newProjectTitle, setNewProjectTitle] = useState<string | undefined>(project?.title);
  const [newProjectDescription, setNewProjectDescription] = useState<string | undefined>(project?.description);
  const [newProjectPicture, setnewProjectPicture] = useState<File>();

  const inputImage = useRef(null); // User upload profile picture

  async function handleOnClick() {
    // send patch request to update project title and description
    // setProject(new updated project)

    if (newProjectPicture) { // Upload and update project img if not empty
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
    }

    setIsProjectEditable(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) { // Upload image
    const imageToUpload = event.target.files![0];
    setnewProjectPicture(imageToUpload);
  }

  return (
    <div className="project-description-container">
      <img src={projectImageURL} alt="project photo" className="project-photo" />
      <div className="title-description-container">
        <div className="project-title-btn-container">
          <input type="text" className="project-page-title editable-title" value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} />
          <button className="edit-project-btn" onClick={handleOnClick}><span className="material-symbols-outlined">edit</span></button>
        </div>
        {/* <input type="text" className="editable-description" value={newProjectDescription} onChange={(e) => setNewProjectDescription(e.target.value)} /> */}
        <textarea className="editable-description" value={newProjectDescription} onChange={(e) => setNewProjectDescription(e.target.value)} />
        <input type="file" ref={inputImage} onChange={handleChange} accept="image/*" />
        {/* <h1>{project?.title}</h1> */}
        {/* <p>{project?.description}</p> */}
      </div>
    </div >
  )
}

export default EditableProjectDescription;