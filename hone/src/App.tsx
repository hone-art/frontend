import { useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Root from './routes/Root';
import Signup from './routes/Signup';
import Profile from './routes/Profile';
import Project from './routes/Project';
import { User } from "./globals"
import "./App.css";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/:username" element={<Profile user={user} isLoggedIn={isLoggedIn} />} />
        <Route path="/:username/:projectId" element={<Project />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
