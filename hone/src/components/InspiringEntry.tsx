import { FC } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/inspiration.css";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'


type Props = {
  entry: {
    "id": number,
    "description": string,
    "img_id": number,
    "project_id": number,
    "user_id": number,
    "created_date": Date,
    "user_name": string,
    "profile_picture": string,
    "entry_img": string
  }
}

const InspiringEntry: FC<Props> = ({ entry }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const date = (new Date(entry.created_date)).toDateString();
  const navigate = useNavigate();

  return (
    <>
      <img className="inspiring-entry" src={entry.entry_img} onClick={onOpen}></img>
      <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} returnFocusOnClose={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginTop="0.5em">
            <div className="inspiring-entry-modal-header-container">
              <img className="inspiring-entry-pfp" src={entry.profile_picture} onClick={() => { navigate(`/${entry.user_name}`) }}></img>
              <div className="inspiring-entry-name-date-container">
                <p className="inspiring-entry-username" onClick={() => { navigate(`/${entry.user_name}`) }}>{entry.user_name}</p>
                <p className="inspiring-entry-date">{date}</p>
              </div>
            </div>
          </ModalHeader>
          <ModalCloseButton margin="0.5em 0.5em" />
          <ModalBody>
            <img className="inspiring-entry-modal-img" src={entry.entry_img}></img>
          </ModalBody>
          <ModalFooter>
            <div className="inspiring-entry-description">
              {entry.description}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default InspiringEntry;