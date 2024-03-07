import { useRef, FC } from "react";
import "../styles/header.css";
import { User } from "../globals";
import { Link } from "react-router-dom";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <header className="header">
      <button className="hone-button">hone</button>
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
            <h1>Yurika</h1>
            <p>@yurikahirata</p>
          </DrawerHeader>

          <DrawerBody>
            {/* <Link to={`/${user!.user_name}`}>Your profile</Link> */}
          </DrawerBody>

          <DrawerFooter>
            <Link to="/">Logout</Link>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </header>

  )
}

export default LoggedInHeader;