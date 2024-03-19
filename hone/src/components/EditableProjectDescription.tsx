import { FC, useState, Dispatch, useRef } from "react";
import { Image, Project } from "../globals";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import "../styles/project.css";

type Props = {
  project: Project | undefined;
  setIsProjectEditable: Dispatch<React.SetStateAction<boolean>>;
  setProject: Dispatch<React.SetStateAction<Project | undefined>>;
  setProjectImage: Dispatch<React.SetStateAction<Image | undefined>>;
}

const EditableProjectDescription: FC<Props> = ({ project, setProject, setProjectImage, setIsProjectEditable }) => {
  const [newProjectTitle, setNewProjectTitle] = useState<string | undefined>((project?.title) == "Untitled" ? "" : project?.title);
  const [newProjectDescription, setNewProjectDescription] = useState<string | undefined>(project?.description);
  const [newProjectPicture, setnewProjectPicture] = useState<File | null>(null);
  const [imageLimitErrorMessage, setImageLimitErrorMessage] = useState<string>("");

  const inputImage = useRef(null); // User upload profile picture

  async function handleOnClick() {
    const submitButtonEl = document.getElementById("edit-project-submit-btn") as HTMLButtonElement;
    submitButtonEl.disabled = true;

    const uploadButtonEl = document.getElementById("project-upload-img") as HTMLInputElement;
    uploadButtonEl.disabled = true;

    const editDescriptionEl = document.getElementById("editable-description") as HTMLTextAreaElement;
    editDescriptionEl.disabled = true;

    const editTitleEl = document.getElementById("editable-title") as HTMLInputElement;
    editTitleEl.disabled = true;

    const updateProjectBody = { title: newProjectTitle == "" ? "Untitled" : newProjectTitle, description: newProjectDescription }
    const fetchUpdatedProject = await fetch(`${process.env.API_URL}/projects/${project?.id}`, {
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

      const newPhotoBody = { url: imgUrl, filePath: newProjectPicture.name };
      const fetchNewPhoto = await fetch(`${process.env.API_URL}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPhotoBody),
      });

      const newPhoto = await fetchNewPhoto.json();
      setProjectImage(newPhoto);

      const updateProjectBody = { img_id: newPhoto.id };
      const fetchUpdatedProject = await fetch(`${process.env.API_URL}/projects/${project?.id}`, {
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
    setImageLimitErrorMessage("");
    submitButtonEl.disabled = false;
    uploadButtonEl.disabled = false;
    editDescriptionEl.disabled = false;
    editTitleEl.disabled = false;
    setIsProjectEditable(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) { // Upload image
    const imageToUpload = event.target.files![0];
    if (imageToUpload.size > 21000000) {
      setImageLimitErrorMessage("Image size cannot exceed 20MB. Please choose another one.")
      setnewProjectPicture(null);
      return;
    } else {
      setImageLimitErrorMessage("");
    }
    console.log(imageToUpload.size);
    new Compressor(imageToUpload, {
      quality: 0.6,
      success(result: any) {
        setnewProjectPicture(result);
      }
    })
  }

  return (
    <>
      <div className="title-description-container">
        <div className="project-title-btn-container">
          <input id="editable-title" type="text" className="project-page-title editable-title" value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} placeholder="Untitled" />
        </div>
        <textarea id="editable-description" className="editable-description" value={newProjectDescription} onChange={(e) => setNewProjectDescription(e.target.value)} placeholder="Write your description here!" autoFocus />
        <p className="error-message">{imageLimitErrorMessage}</p>
        <div className="project-upload-submit-container">
          <input id="project-upload-img" type="file" ref={inputImage} onChange={handleChange} accept="image/*" />
          <button id="edit-project-submit-btn" className="edit-project-submit-btn" onClick={handleOnClick}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default EditableProjectDescription;