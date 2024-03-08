import { FC } from "react";
import "../styles/project.css"
import { useParams } from "react-router-dom";

const Project: FC = () => {
  const { username, projectId} = useParams<string>();
  
  return (
    <>

    </>
  )
};

export default Project;