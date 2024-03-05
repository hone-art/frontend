import { FC } from "react";
import { User } from "../globals";
import "../styles/profile.css";
// import { useParams } from "react-router-dom";

type Props = {
  user: User | null;
}

const Profile: FC<Props> = ({ user }) => {
  // const { username } = useParams<string>();

  return (
    <>

    </>
  )
};

export default Profile;