import { FC, Dispatch } from "react";
import { Project } from "../globals";
import "../styles/project.css";

type Props = {
  project: Project | undefined;
  isSameUser: boolean;
  setIsProjectEditable: Dispatch<React.SetStateAction<boolean>>;
  onSettingsOpen: () => void;
}

const ProjectDescription: FC<Props> = ({ project, isSameUser, setIsProjectEditable, onSettingsOpen }) => {
  return (
    <>
      <div className="title-description-container">
        <div className="project-title-btn-container">
          <h1 className="project-page-title">{project?.title}</h1>
          {isSameUser ? <button className="edit-project-btn" onClick={() => setIsProjectEditable(true)}><span className="material-symbols-outlined">edit</span></button> : null}
          {isSameUser ? <button className="edit-project-btn" onClick={onSettingsOpen}><span className="material-symbols-outlined">settings</span></button> : null}
        </div>
        <p className="title-p">{project?.description}</p>
      </div>
    </>
  )
}

export default ProjectDescription;