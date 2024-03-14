import { useRef, FC, useEffect, useState } from "react";
import "../styles/header.css";
import { User } from "../globals";
import { Link, useNavigate } from "react-router-dom";
// import Cookies from "universal-cookie";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';

type Props = {
  user: User | null;
}

const LoggedInHeader: FC<Props> = ({ user }) => {
  const [profilePhotoURL, setProfilePhotoURL] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const navigate = useNavigate();
  // const cookies = new Cookies();

  useEffect(() => {
    async function fetchPhoto() {
      const fetchPhoto = await fetch(`${process.env.API_URL}/images/${user?.img_id}`);
      const photo = await fetchPhoto.json();

      setProfilePhotoURL(photo.url);
    }

    fetchPhoto();
  }, [])

  async function handleLogoutOnClick() {
    await fetch(`${process.env.API_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });
    navigate("/");
    return;
  }

  return (
    <header className="header">
      {/* <p>CHANGE TO USERNAME</p> */}
      <Link to={`/${user?.user_name}`} className="hone-button">hone</Link>
      <button onClick={onOpen} className="menu-button"><span className="material-icons">menu</span></button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton className="drawer-close-btn" />
          {/* <DrawerHeader>{user?.display_name}</DrawerHeader> */}
          <DrawerHeader>
            <div className="drawer-header-container">
              <img className="profile-photo" src={profilePhotoURL} alt="profile picture" />
              <div className="drawer-names">
                <h1>{user?.display_name}</h1>
                <p className="menu-display-name">@{user?.user_name}</p>
              </div>
            </div>
            <hr />
            {/* <h1>{user?.display_name}</h1>
            <p>@{user?.user_name}</p> */}
          </DrawerHeader>

          <DrawerBody>
            <div className="drawer-link-container">
              <span className="material-symbols-outlined">
                account_circle
              </span>
              <Link className="link" to={`/${user?.user_name}`}>Your profile</Link>
            </div>
            <div className="drawer-link-container">
              <span className="material-symbols-outlined">
                calendar_month
              </span>
              <Link className="link" to={`/${user?.user_name}/calendar`}>Your calendar</Link>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <p className="link" onClick={handleLogoutOnClick}> Logout →</p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </header >

  )
}

export default LoggedInHeader;