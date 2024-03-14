// import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import { FC, useState, useEffect } from "react";
import "../styles/root.css"
// import { Link, useNavigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
// import { User } from "../globals";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from '../utils/firebaseConfig';
import { useAuth } from "../hooks/useAuth";

// type Props = {
//   setUser: (initialState: User | (() => User | null) | null) => void;
//   setIsLoggedIn: Dispatch<SetStateAction<boolean>>
// }

// const Root: FC<Props> = () => {
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
  // useEffect(() => {
  //   setUser(null);
  //   setIsLoggedIn(false);

  //   async function fetchAutoLogin() {
  //     const autoLogin = await fetch(`${process.env.API_URL}/autoLogin`, {
  //       method: "GET",
  //       credentials: "include",
  //     })

  //     if (autoLogin.status == 200) {
  //       const loggedUser = await autoLogin.json();
  //       console.log(loggedUser);
  //       setUser(loggedUser);
  //       setIsLoggedIn(true);

  //       navigate(`/${loggedUser?.user_name}`);
  //     }
  //   }
  //   fetchAutoLogin();

  // }, [])

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
      // setUser(userObj);
      // setIsLoggedIn(true);

      // navigate(`/${userObj?.user_name}`)
    } catch (error: any) {
      console.log(error);
      setErrorMessage('Invalid email or password. Please try again');
    }
  }

  return (
    <section className="root-container">
      <div className="login-container">
        <h1 className="title">hone</h1>
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
  )
};

export default Root;