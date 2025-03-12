import { useState, useEffect } from "react";
import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import Home from "./Home";
import Navbar from "./Navbar";
import Account from "./Account";

import Login from "./Login";
import Register from "./Register";
import PlayerPage from "./PlayerPage";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    console.log("hello world");

    const tryToLogin = async () => {
      if (token) {
        const response = await axios.get(
          "https://ywratemyplayersbackend2025.onrender.com/account",
          {
            headers: { authorization: token },
          }
        );

        setUser(response.data);
        navigate("/");
      }
    };

    tryToLogin();
  }, []);

  const logout = () => {
    setTimeout(() => setUser(null), 0);
    window.localStorage.removeItem("token");
  };

  return (
    <div style={{}}>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/account" element={<Account user={user} />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/players/:region/:name"
          element={<PlayerPage user={user} />}
        />
      </Routes>
    </div>
  );
}

export default App;
