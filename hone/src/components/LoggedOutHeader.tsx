import "../styles/header.css";
import { useNavigate } from "react-router-dom";

const LoggedOutHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="hone-button" onClick={() => navigate("/")}><img src="/hone_white.png" alt="hone image" /></div>
      <button className="logged-out-header-btn" onClick={() => navigate("/")}>Login</button>
    </header>
  )
}

export default LoggedOutHeader;