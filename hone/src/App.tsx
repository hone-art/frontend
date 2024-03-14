// import { useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Root from './routes/Root';
import Signup from './routes/Signup';
import Profile from './routes/Profile';
import Project from './routes/Project';
import Calendar from './routes/Calendar';
// import { User } from "./globals"
import "./App.css";
import { AuthProvider } from './hooks/useAuth';


function App() {
  // const [user, setUser] = useState<User | null>(null);
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<Root setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/:username" element={<Profile user={user} setUser={setUser} isLoggedIn={isLoggedIn} />} />
          <Route path="/:username/calendar" element={<Calendar user={user} />} />
          <Route path="/:username/projects/:projectId" element={<Project user={user} isLoggedIn={isLoggedIn} />} /> */}
          <Route path="/" element={<Root />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/:username/calendar" element={<Calendar />} />
          <Route path="/:username/projects/:projectId" element={<Project />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
