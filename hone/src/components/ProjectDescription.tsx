import { FC, Dispatch } from "react";
import { Project } from "../globals";
import "../styles/project.css";

type Props = {
  project: Project | undefined;
  projectImageURL: string;
  isSameUser: boolean;
  setIsProjectEditable: Dispatch<React.SetStateAction<boolean>>;
}

const ProjectDescription: FC<Props> = ({ project, projectImageURL, isSameUser, setIsProjectEditable }) => {
  return (
    <div className="project-description-container">
      <img src={projectImageURL} alt="project photo" className="project-photo" />
      <div className="title-description-container">
        <div className="project-title-btn-container">
          <h1 className="project-page-title">{project?.title}</h1>
          {isSameUser ? <button className="edit-project-btn" onClick={() => setIsProjectEditable(true)}><span className="material-symbols-outlined">edit</span></button> : null}
        </div>
        <p>{project?.description}</p>
      </div>
    </div>
  )
}

export default ProjectDescription;