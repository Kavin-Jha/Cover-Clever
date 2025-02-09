import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Home from './pages/Home';
import Score from './pages/Score';
// import Register from './pages/Register';

import { User } from './types/User';

import './App.css'

const App: React.FC = () =>  {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Clear session if the page is refreshed
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <HashRouter>
      {/* {user && (
        <NavBar
          user={user}
          onLogout={handleLogout}
          title="Nextap"
        />
      )} */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<Score />} /> 
      </Routes>
    </HashRouter>
  )
}

export default App
