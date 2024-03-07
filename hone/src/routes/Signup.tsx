import { FC, useState } from "react";
import "../styles/signup.css"
import { Link, useNavigate } from "react-router-dom";
import { User } from "../globals";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from '../utils/firebaseConfig';
// const BACKEND_URL = 'https://hone-backend-6c69d7cab717.herokuapp.com/';
const BACKEND_URL = 'http://localhost:8080/'



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
    console.log(await fetch(BACKEND_URL).then(response => {return response.text()}));

    // check if password and confirm password are same. 
    // If same, clear error message, continue, 
    // if not, return, stop further function execution.
    try {
      await checkPasswordsAreSame(password, confirmPassword);
      setErrorMessage('');
    } catch (error) {
      setPassword('');
      setConfirmPassword('');
      setErrorMessage('Passwords do not match. Please try again.')
      return;
    }

    console.log('password match==========')

    // Create user in firebase
    // check validation of email, password
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      console.log('firebase succeed');
    } catch (error:any) {
      console.log(error.message);
      const errorMessage:string = error.message;
      if(errorMessage === 'Firebase: Error (auth/invalid-email).') {
        setErrorMessage('Invalid Email address');
        setEmail('');
      } else if(errorMessage === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
        setErrorMessage('Password should be at least 6 characters');
        setPassword('');
        setConfirmPassword('');
      } else if(errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
        setErrorMessage('Email-already-in-use');
      }
      return;
    }

    console.log('after firebase error');

    
    

    // Create user in firebase
    // const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    // const uuid: string = userCredential.user.uid;

    // Post request to create user in database
    // const reqBody = JSON.stringify({
    //   uuid: uuid,
    //   display_name: displayName,
    //   user_name: username
    // });
    // const response = await fetch(`${BACKEND_URL}/user/`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', },
    //   body: reqBody,
    // });
    // If okay set returned user object and navigate to "/:username"
    // const user = (await fetch(`${BACKEND_URL}/users/:uuid`)).json()
    // setUser(user); // replace null with user object
    // navigate(`/${user.username}`); // replace user with user.username
    // // Else setErrorMessage to "username is taken"
    // setErrorMessage("Username is taken");
  }

  const checkPasswordsAreSame = async (password: string, confirmPassword: string) => {
    return new Promise((resolve, reject) => {
      if (password === confirmPassword) {
        resolve(true);
      } else {
        reject(new Error('Password do not match'));
      };
    });
  };


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
          <input type="submit" className="signup-button" value="create account" onClick={handleOnClick} />
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