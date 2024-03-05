import { FC, useState } from "react";
import "../styles/root.css"
import { Link, useNavigate } from "react-router-dom";
import { User } from "../globals";

type Props = {
  user: User | null;
  setUser: (initialState: User | (() => User | null) | null) => void;
}

const Root: FC<Props> = ({ user, setUser }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleOnClick = () => {
    // User authentication
    // If authenticated get + set user object from users table and navigate to "/:username"
    setUser(null); // replace null with user object
    navigate(`/${user}`) // replace user with user.username
  }

  return (
    <section className="root-container">
      <div className="login-container">
        <h1 className="title">hone</h1>
        <h2 className="subtitle">sharpen those art skills.</h2>
        <input className="login-input" type="email" placeholder="enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="login-input" type="password" placeholder="enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="login-button" onClick={handleOnClick}>login</button>
        <Link to="/signup" className="signup-link">
          Don't have an account? Create one here →
        </Link>
      </div>
    </section>
  )
};

export default Root;