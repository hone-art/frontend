import { FC, useEffect, useState, useRef } from "react";
import { Entry as EntryInterface } from "../globals";
import "../styles/entry.css"
import { Img } from "@chakra-ui/react";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import RelativeTime from "./relativeTimeFormator";
// const BACKEND_URL = 'https://hone-backend-6c69d7cab717.herokuapp.com';
const BACKEND_URL = 'http://localhost:8080';

type Props = {
  entry: EntryInterface;
  isSameUser: boolean;
}

const Entry: FC<Props> = ({ entry, isSameUser }) => {
  const [imageURL, setImageURL] = useState<string>("");
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [entryDescription, setEntryDescription] = useState<string>(entry.description);
  const [newEntryDescription, setNewEntryDescription] = useState<string>(entry.description);
  const [newEntryImage, setNewEntryImage] = useState<File>();

  const inputImage = useRef(null);

  useEffect(() => {
    async function fetchImage() {
      const fetchImage = await fetch(`${BACKEND_URL}/images/${entry?.img_id}`);
      const image = await fetchImage.json();
      setImageURL(image.url);
    }

    if (entry.img_id != null) fetchImage();
  }, [])

  async function handleOnClick() {
    if (isEditable) {
      // patch request to update entry to newEntryDescription

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

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) { // Upload image
    const imageToUpload = event.target.files![0];
    setNewEntryImage(imageToUpload);
  }

  return (
    <div className="entry-container">
      {imageURL !== "" ? <img src={imageURL} className="entry-img" /> : null}
      {isEditable ? <input type="file" ref={inputImage} onChange={handleChange} accept="image/*" /> : null}
      <div className="entry-date-description-container">
        <div className="entry-date-button-container">
          {/* <p>{String(entry.created_date)}</p><hr /> */}
          <RelativeTime date={entry.created_date} /><hr />
          {isSameUser ? <button className="edit-entry-btn" onClick={handleOnClick}><span className="material-symbols-outlined">edit</span></button> : null}
        </div>
        {isEditable ? <textarea className="editable-entry-description" value={newEntryDescription} onChange={(e) => setNewEntryDescription(e.target.value)} /> : <p>{entryDescription}</p>}
      </div>
    </div>
  )
}

export default Entry;