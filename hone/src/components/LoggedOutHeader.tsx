import "../styles/header.css";
import { useNavigate } from "react-router-dom";

const LoggedOutHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <button className="hone-button" onClick={() => navigate("/")}>hone</button>
      <button className="logged-out-header-btn" onClick={() => navigate("/")}>Login</button>
    </header>
  )
}

export default LoggedOutHeader;