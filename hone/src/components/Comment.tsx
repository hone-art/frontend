import { useState, FC, useEffect, Dispatch } from "react";
import { User, Comment as CommentInterface, Image } from "../globals";
import "../styles/comments.css";
import { useAuth } from "../hooks/useAuth";

type Props = {
  comment: CommentInterface;
  setComments: Dispatch<React.SetStateAction<CommentInterface[]>>
}

const Comment: FC<Props> = ({ comment, setComments }) => {

  const [userProfile, setUserProfile] = useState<User | null>(null); // User of profile that is shown
  const [profilePicture, setProfilePicture] = useState<Image>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserAndPicture() {
      const fetchThisUser = await fetch(`${process.env.API_URL}/users/ids/${comment.user_id}`);
      const thisUser: User = await fetchThisUser.json();
      setUserProfile(thisUser);

      const fetchPicture = await fetch(`${process.env.API_URL}/images/${thisUser.img_id}`);
      const picture = await fetchPicture.json();
      setProfilePicture(picture);
      setIsLoaded(true);
    }

    fetchUserAndPicture();
  }, [])

  async function handleDeleteOnClick() {
    const fetchDelete = await fetch(`${process.env.API_URL}/comments/${comment.id}`, {
      method: "DELETE"
    });

    if (fetchDelete.status === 200) {
      setComments((prev) => {
        const newArray = prev.filter((thisComment) => thisComment.id !== comment.id);
        return newArray;
      })
    }
  }

  return (
    isLoaded ? <section className="comment-container">
      <img src={profilePicture?.url} alt="profile picture" className="comment-profile-picture" />
      <div className="profile-name-comment-container">
        <h1 className="comment-display-name">{userProfile?.user_name}</h1>
        <p>{comment.description}</p>
      </div>
      {(user!.id === comment.user_id) ? <button className="edit-entry-btn delete-comment-btn" onClick={handleDeleteOnClick}><span className="material-symbols-outlined">delete</span></button> : null}
    </section> : null
  )
}

export default Comment;