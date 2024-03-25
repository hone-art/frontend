import { FC, useState, useEffect } from "react";
import "../styles/root.css"
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from '../utils/firebaseConfig';
import { useAuth } from "../hooks/useAuth";

const Root: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { login, autoLogin } = useAuth();

  useEffect(() => {
    async function fetchAutoLogin() {
      const result = await autoLogin();
      if (result !== null) {
        navigate(`/${result?.user_name}`)
      }
    }

    fetchAutoLogin();
  }, [])

  const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const uuid = credential.user.uid;
      setErrorMessage('');

      const response = await fetch(`${process.env.API_URL}/users/${uuid}`, {
        method: 'GET',
        credentials: 'include'
      });
      const userObj = await response.json();

      login(userObj);

    } catch (error: any) {
      console.log(error);
      setErrorMessage('Invalid email or password. Please try again');
    }
  }

  return (
    <main id="root-page">
      <section className="root-container">
        <div className="login-container">
          <img src="/hone_black.png" alt="hone logo" className="root-hone-logo" />
          <h2 className="subtitle">sharpen those art skills.</h2>
          <form action="">
            <input className="login-input" type="email" placeholder="enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="login-input" type="password" placeholder="enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input className="login-button" value='Login' onClick={handleOnClick} readOnly />
          </form>
          <p className="error-message">{errorMessage}</p>
          <Link to="/signup" className="signup-link">
            Don't have an account? Create one here →
          </Link>
        </div>
      </section>
      <section className="intro-container">
        <h2 className="title">Why Hone?</h2>
        <p className="subtitle">Document your art journey</p>
        <img className="screenshot margin-top" src="/hone_project.png" alt="project page screenshot" />
        <img className="screenshot margin-bottom" src="/hone_project_2.png" alt="project page screenshot continued" />
        <p className="subtitle margin-top">Share your art (if you want)!</p>
        <img className="screenshot margin-top margin-bottom" src="/hone_profile.png" alt="profile page screenshot" />
        <p className="subtitle margin-top">Reminisce</p>
        <img className="screenshot margin-top" src="/hone_header.png" alt="header screenshot" />
        <img className="screenshot margin-bottom" src="/hone_calendar.png" alt="calendar screenshot" />
        <p className="subtitle margin-top">And more!</p>
      </section>
    </main>
  )
};

export default Root;