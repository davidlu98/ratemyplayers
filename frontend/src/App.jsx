import { useState, useEffect } from "react";
import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import Home from "./Home";
import Navbar from "./Navbar";
import Account from "./Account";
import Login from "./Login";
import Register from "./Register";
import Feedback from "./Feedback";
import BannedPage from "./BannedPage";

import PlayerPage from "./PlayerPage";
import CreateReview from "./CreateReview";
import ReportReview from "./ReportReview";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    const tryToLogin = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/account`, {
            headers: { authorization: token },
          });

          setUser(response.data);
          navigate("/");
        } catch (error) {
          console.log(error);
          if (error.response?.status === 403) {
            window.localStorage.removeItem("token");
            setUser(null);
            navigate("/banned");
          }
        }
      }
    };

    tryToLogin();
  }, []);

  const logout = () => {
    setTimeout(() => setUser(null), 0);
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/account" element={<Account user={user} />} />
        <Route path="/banned" element={<BannedPage />} />
        <Route
          path="/players/:region/:name"
          element={<PlayerPage user={user} />}
        />
        <Route
          path="/write-review/:region/:playerName/:playerId"
          element={<CreateReview />}
        />
        <Route
          path="/report-review/:region/:playerName/:reviewId"
          element={<ReportReview />}
        />
      </Routes>
    </div>
  );
}

export default App;
