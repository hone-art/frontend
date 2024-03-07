import { FC, useState } from "react";
import "../styles/signup.css"
import { Link, useNavigate } from "react-router-dom";
import { User } from "../globals";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from '../utils/firebaseConfig';
const BACKEND_URL = 'https://hone-backend-6c69d7cab717.herokuapp.com/';



type Props = {
  user: User | null;
  setUser: (initialState: User | (() => User | null) | null) => void;
}

const Signup: FC<Props> = ({ user, setUser }) => {
  // dotenv.config();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleOnClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    console.log(BACKEND_URL);

    // Create user in firebase
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const uuid: string = userCredential.user.uid;

    // Post request to create user in database
    const reqBody = JSON.stringify({
      uuid: uuid,
      display_name: displayName,
      user_name: username
    });
    const response = await fetch(`${BACKEND_URL}/user/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: reqBody,
    });
    // If okay set returned user object and navigate to "/:username"
    setUser({
      id: uuid,
      display_name: displayName,
      username: username,
      img_id: 
    }); // replace null with user object
    navigate(`/${user}`); // replace user with user.username
    // Else setErrorMessage to "username is taken"
    setErrorMessage("Username is taken");
  }


  return (
    <section className="section-container">
      <div className="signup-container">
        <h1 className="title">hone</h1>
        <h2 className="subtitle">sharpen those art skills.</h2>
        <form>
          <input className="signup-input email-input" type="email" placeholder="enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="input-group">
            <input className="signup-input input-half" type="text" placeholder="enter a username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input className="signup-input input-half" type="text" placeholder="enter a display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="input-group">
            <input className="signup-input input-half" type="password" placeholder="enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input className="signup-input input-half" type="password" placeholder="confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <input type="submit" className="signup-button" value="Create account" onClick={handleOnClick} />
        </form>
        <p className="error-message">{errorMessage}</p>
        <Link to="/" className="login-link">
          Already have an account? Login here →
        </Link>
      </div>
    </section >
  )
};

export default Signup;