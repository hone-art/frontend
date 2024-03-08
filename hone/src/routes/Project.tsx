import { FC } from "react";
import "../styles/project.css"
import { useParams } from "react-router-dom";
import { User } from '../globals';


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

    </>
  )
};

export default Project;