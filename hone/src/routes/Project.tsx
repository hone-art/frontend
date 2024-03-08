import { FC, useState } from "react";
import "../styles/project.css"
import { useParams } from "react-router-dom";
import { User } from '../globals';
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";



type Props = {
  user: User | null;
  isLoggedIn: boolean;
}

const Project: FC<Props> = ({ user, isLoggedIn }) => {
  const { username, projectId} = useParams<string>();
  const [viewerUserName, setViewerUserName] = useState<string>(username);
  const [projectOwnerName, setProjectOwnerName] = useState<string>("");



  return (
    <>
      {isLoggedIn ? <LoggedInHeader user={user}/> : <LoggedOutHeader />}
      {viewerUserName}
      {}
    </>
  )
};

export default Project;