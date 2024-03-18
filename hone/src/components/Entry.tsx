import { FC, useEffect, useState, useRef, Dispatch } from "react";
import { Entry as EntryInterface, Image, Comment as CommentInterface } from "../globals";
import "../styles/entry.css";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes, getStorage, deleteObject } from "firebase/storage";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import Comment from "./Comment";
import { useAuth } from "../hooks/useAuth";

type Props = {
  entry: EntryInterface;
  isSameUser: boolean;
  setEntries: Dispatch<React.SetStateAction<EntryInterface[] | undefined>>;
  isCommentsOn: boolean | undefined;
}

const Entry: FC<Props> = ({ entry, setEntries, isSameUser, isCommentsOn }) => {
  const [image, setImage] = useState<Image>();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [entryDescription, setEntryDescription] = useState<string>(entry.description);
  const [newEntryDescription, setNewEntryDescription] = useState<string>(entry.description);
  const [newEntryImage, setNewEntryImage] = useState<File>();
  const [dateCreatedString, setDateCreated] = useState<string>("");
  const [comments, setComments] = useState<CommentInterface[]>([]); //use array
  const [newComment, setNewComment] = useState<string>("");
  const { user, isLoggedIn } = useAuth();

  const inputImage = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isCommentsOpen, onOpen: onCommentsOpen, onClose: onCommentsClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  useEffect(() => {
    async function fetchImage() {
      const fetchImage = await fetch(`${process.env.API_URL}/images/${entry?.img_id}`);
      const image = await fetchImage.json();
      setImage(image);
    }

    if (entry.img_id != null) fetchImage();

    let setDate = new Date(entry.created_date);
    const setDateString = setDate.toLocaleString();
    setDateCreated(setDateString);

    if (isCommentsOn) {
      async function fetchComments() {
        const fetchComment = await fetch(`${process.env.API_URL}/comments/entries/${entry?.id}`);
        const comments = await fetchComment.json();
        setComments(comments);
      }
      fetchComments();
    }

  }, [])

  async function handleEditOnClick() {

    if (isEditable) {
      const submitButtonEl = document.getElementById("entry-submit-btn") as HTMLButtonElement;
      submitButtonEl.disabled = true;

      const uploadButtonEl = document.getElementById("entry-upload-btn") as HTMLInputElement;
      uploadButtonEl.disabled = true;

      const entryDescriptionEl = document.getElementById("editable-entry-description") as HTMLTextAreaElement;
      entryDescriptionEl.disabled = true;

      const updateEntryDescriptionBody = { description: newEntryDescription };
      const fetchUpdatedEntry = await fetch(`${process.env.API_URL}/entries/${entry?.id}`, {
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

        const newPhotoBody = { url: imgUrl, filePath: newEntryImage.name };
        const fetchNewPhoto = await fetch(`${process.env.API_URL}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPhotoBody),
        });

        const newPhoto = await fetchNewPhoto.json();
        setImage(newPhoto);

        const updateEntryBody = { img_id: newPhoto.id };
        await fetch(`${process.env.API_URL}/entries/${entry?.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateEntryBody),
        });
      }

      setIsEditable(false);
      submitButtonEl.disabled = false;
      uploadButtonEl.disabled = false;
      entryDescriptionEl.disabled = false;
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

    await fetch(`${process.env.API_URL}/entries/${entry?.id}`, {
      method: "DELETE",
    })

    if (image) {
      await fetch(`${process.env.API_URL}/images/${image?.id}`, {
        method: "DELETE",
      });

      const storage = getStorage();
      const deleteRef = ref(storage, image?.filePath);
      deleteObject(deleteRef);
    }

  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) { // Upload image
    const imageToUpload = event.target.files![0];

    setNewEntryImage(imageToUpload);
  }

  async function handleCommentOnClick() {
    const body = { description: newComment, user_id: user?.id, entry_id: entry.id }
    if (newComment !== "") {
      const fetchNewComment = await fetch(`${process.env.API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const newComment = await fetchNewComment.json();
      setComments((prev) => {
        const newArray = [...prev];
        newArray.push(newComment);
        return newArray;
      });
    }
    setNewComment("");
  }

  return (
    <section>
      <div className="entry-container">
        {image ? <img src={image?.url} className="entry-img" onClick={onOpen} /> : null}
        <div className="entry-date-description-container">
          <div className="entry-date-button-container">
            <p className="entry-date">{dateCreatedString}</p>
            {/* <RelativeTime date={entry.created_date} /><hr /> */}
            {(isSameUser && !isEditable) ? <button className="edit-entry-btn" onClick={handleEditOnClick}><span className="material-symbols-outlined">edit</span></button> : null}
            {isSameUser ? <button className="edit-entry-btn" onClick={onDeleteOpen}><span className="material-symbols-outlined">delete</span></button> : null}
            {(isCommentsOn) ? <button className="edit-entry-btn" onClick={onCommentsOpen}><span className="material-symbols-outlined">comment</span></button> : null}
          </div>
          <hr />
          {isEditable ? <textarea id="editable-entry-description" className="editable-entry-description" value={newEntryDescription} onChange={(e) => setNewEntryDescription(e.target.value)} autoFocus /> : <p className="entry-p"> {entryDescription}</p>}
          <div className="entry-upload-submit-container">
            {isEditable ? <input id="entry-upload-btn" type="file" ref={inputImage} onChange={handleChange} accept="image/*" className="entry-upload" /> : null}
            {isEditable ? <button id="entry-submit-btn" className="entry-submit-btn" onClick={handleEditOnClick}>Submit</button> : null}
          </div>
        </div>
      </div>

      <Modal isOpen={isCommentsOpen} onClose={onCommentsClose} autoFocus={false} returnFocusOnClose={false}>
        <ModalOverlay />
        <ModalContent className="comments-modal">
          <ModalCloseButton className="modal-close-btn" />
          <ModalHeader>Comments</ModalHeader>
          <ModalBody className="comments-modal-body">
            {comments?.map((comment) => (
              <Comment key={comment.id} comment={comment} setComments={setComments} />
            ))}
          </ModalBody>
          <ModalFooter>
            {isLoggedIn ? <div className="comment-input-submit-container">
              <input className="comment-input" type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} autoFocus placeholder="Add a comment..." />
              <button onClick={handleCommentOnClick} className="comment-submit-btn">Submit</button>
            </div> :
              <input type="text" placeholder="Log in to add a comment!" disabled className="disabled-comment-input" />
            }
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} returnFocusOnClose={false}>
        <ModalOverlay />
        <ModalContent maxH="90vh" maxW="90vw" color="transparent" bg="transparent" alignItems={"center"} boxShadow={"none"}>
          <ModalCloseButton margin="0" boxShadow={"none"} bg="white" outline={"transparent"} />
          <ModalBody>
            <img src={image?.url} className="entry-img-full" />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginTop="0.5em">Are you sure you want to delete <br />this entry?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This action cannot be undone!
          </ModalBody>
          <ModalFooter>
            <div className="btn-container">
              <button className="modal-btn cancel-btn" onClick={onDeleteClose}>Cancel</button>
              <button className="modal-btn" id="delete-project-btn" onClick={handleDeleteOnClick}>Delete</button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  )
}

export default Entry;