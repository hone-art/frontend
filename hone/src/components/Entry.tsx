import { FC, useEffect, useState, useRef, Dispatch } from "react";
import { Entry as EntryInterface } from "../globals";
import "../styles/entry.css";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
// const BACKEND_URL = 'https://hone-backend-6c69d7cab717.herokuapp.com';
const BACKEND_URL = 'http://localhost:8080';

type Props = {
  entry: EntryInterface;
  isSameUser: boolean;
  setEntries: Dispatch<React.SetStateAction<EntryInterface[] | undefined>>
}

const Entry: FC<Props> = ({ entry, setEntries, isSameUser }) => {
  const [imageURL, setImageURL] = useState<string>("");
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [entryDescription, setEntryDescription] = useState<string>(entry.description);
  const [newEntryDescription, setNewEntryDescription] = useState<string>(entry.description);
  const [newEntryImage, setNewEntryImage] = useState<File>();
  const [dateCreatedString, setDateCreated] = useState<string>("");
  const inputImage = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    async function fetchImage() {
      const fetchImage = await fetch(`${BACKEND_URL}/images/${entry?.img_id}`);
      const image = await fetchImage.json();
      setImageURL(image.url);
    }

    if (entry.img_id != null) fetchImage();

    let setDate = new Date(entry.created_date);
    const setDateString = setDate.toLocaleString();
    setDateCreated(setDateString);

  }, [])

  async function handleEditOnClick() {
    if (isEditable) {
      const updateEntryDescriptionBody = { description: newEntryDescription };
      const fetchUpdatedEntry = await fetch(`${BACKEND_URL}/entries/${entry?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateEntryDescriptionBody),
      });

      const updatedEntry = await fetchUpdatedEntry.json();
      setEntryDescription(updatedEntry.description);

      if (newEntryImage) { // Upload and update project img if not empty
        const storageRef = ref(storage, `${newEntryImage.name}`);
        const snapshot = await uploadBytes(storageRef, newEntryImage);
        const imgUrl = await getDownloadURL(snapshot.ref);

        const newPhotoBody = { url: imgUrl };
        const fetchNewPhoto = await fetch(`${BACKEND_URL}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPhotoBody),
        });

        const newPhoto = await fetchNewPhoto.json();
        setImageURL(newPhoto.url);

        const updateEntryBody = { img_id: newPhoto.id };
        await fetch(`${BACKEND_URL}/entries/${entry?.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateEntryBody),
        });
      }

      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  }

  async function handleDeleteOnClick() {
    setEntries((prev) => {
      const newArray = prev!.filter((thisEntry) => {
        if (thisEntry.id !== entry.id)
          return thisEntry;
      });
      return newArray;
    })

    await fetch(`${BACKEND_URL}/entries/${entry?.id}`, {
      method: "DELETE",
    })
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) { // Upload image
    const imageToUpload = event.target.files![0];
    setNewEntryImage(imageToUpload);
  }

  return (
    <>
      <div className="entry-container">
        {imageURL !== "" ? <img src={imageURL} className="entry-img" onClick={onOpen} /> : null}
        <div className="entry-date-description-container">
          <div className="entry-date-button-container">
            <p className="entry-date">{dateCreatedString}</p>
            {/* <RelativeTime date={entry.created_date} /><hr /> */}
            {isSameUser ? <button className="edit-entry-btn" onClick={handleEditOnClick}><span className="material-symbols-outlined">edit</span></button> : null}
            {isSameUser ? <button className="edit-entry-btn" onClick={handleDeleteOnClick}><span className="material-symbols-outlined">delete</span></button> : null}
          </div>
          <hr />
          {isEditable ? <textarea className="editable-entry-description" value={newEntryDescription} onChange={(e) => setNewEntryDescription(e.target.value)} autoFocus /> : <p className="entry-p"> {entryDescription}</p>}
          {isEditable ? <input type="file" ref={inputImage} onChange={handleChange} accept="image/*" className="entry-upload" /> : null}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxH="90vh" maxW="90vw" color="transparent" bg="transparent" alignItems={"center"} boxShadow={"none"}>
          <ModalCloseButton margin="0" boxShadow={"none"} bg="white" outline={"transparent"} />
          <ModalBody>
            <img src={imageURL} className="entry-img-full" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Entry;