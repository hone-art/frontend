import { FC, Dispatch } from "react";
import { Project } from "../globals";
import "../styles/project.css";

type Props = {
  project: Project | undefined;
  isSameUser: boolean;
  setIsProjectEditable: Dispatch<React.SetStateAction<boolean>>;
}

const ProjectDescription: FC<Props> = ({ project, isSameUser, setIsProjectEditable }) => {
  return (
    <>
      <div className="title-description-container">
        <div className="project-title-btn-container">
          <h1 className="project-page-title">{project?.title}</h1>
          {isSameUser ? <button className="edit-project-btn" onClick={() => setIsProjectEditable(true)}><span className="material-symbols-outlined">edit</span></button> : null}
        </div>
        <p className="title-p">{project?.description}</p>
      </div>
    </>
  )
}

export default ProjectDescription;