import { useState } from "react";
import { User } from "../globals";



const Comment = () => {


  const userProfile  = useState<User | null>(null); // User of profile that is shown
  const [profilePicture, setProfilePicture] = useState<string>("");

  return (
    <>
        
    <img src={profilePicture} alt="profile picture" className="profile-picture" />
          <h1 id="display-name">{userProfile?.display_name}</h1>
          
        {/* {comments?.map((comment) => (
          <Comment comment={comment} key={comment.id} setComments={setComments} isCommentsOn={project?.isCommentsOn} />
        ))} */}
      

    </>
  )
}

export default Comment;