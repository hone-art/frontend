import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import "../styles/root.css"
import { Link, useNavigate } from "react-router-dom";
import { User } from "../globals";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from '../utils/firebaseConfig';

// const BACKEND_URL = 'https://hone-backend-6c69d7cab717.herokuapp.com';
const BACKEND_URL = 'http://localhost:8080';

type Props = {
  setUser: (initialState: User | (() => User | null) | null) => void;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

const Root: FC<Props> = ({ setUser, setIsLoggedIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, [])
  const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const uuid = credential.user.uid;
      setErrorMessage('');
      const response = await fetch(`${BACKEND_URL}/users/${uuid}`);
      const userObj = await response.json();
      setUser(userObj);
      setIsLoggedIn(true);
      navigate(`/${userObj?.user_name}`)
    } catch (error: any) {
      setErrorMessage('Invalid email or password. Please try again');
    }
    // User authentication
    // If authenticated get + set user object from users table and navigate to "/:username"
    // setUser(null); // replace null with user object
    // navigate(`/${user}`); // replace user with user.username
    // else set errorMessage to "Email or password is incorrect"
    // setErrorMessage("Email or password is incorrect");
  }

  return (
    <section className="root-container">
      <div className="login-container">
        <h1 className="title">hone</h1>
        <h2 className="subtitle">sharpen those art skills.</h2>
        <form action="">
          <input className="login-input" type="email" placeholder="enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="login-input" type="password" placeholder="enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input className="login-button" value='Login' onClick={handleOnClick} />
        </form>
        <p className="error-message">{errorMessage}</p>
        <Link to="/signup" className="signup-link">
          Don't have an account? Create one here →
        </Link>
      </div>
    </section>
  )
};

export default Root;