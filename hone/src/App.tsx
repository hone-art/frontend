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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root user={user} setUser={setUser} />} />
        <Route path="/signup" element={<Signup user={user} setUser={setUser} />} />
        <Route path="/:username" element={<Profile user={user} />} />
        <Route path="/:username/:projectId" element={<Project />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
