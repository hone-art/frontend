import "../styles/header.css";
import { useNavigate } from "react-router-dom";

const LoggedOutHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <button className="hone-button" onClick={() => navigate("/")}>hone</button>
    </header>
  )
}

export default LoggedOutHeader;