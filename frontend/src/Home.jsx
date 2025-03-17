import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import RecentReviews from "./RecentReviews";
import MostReviewedPlayers from "./MostReviewedPlayers";

export default function Home() {
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [mostReviewedPlayers, setMostReviewedPlayers] = useState([]);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const getRecentPlayers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/players/recent`);
      setRecentPlayers(data);
    } catch (error) {
      console.log("Error when fetching recent players");
    }
  };

  const getMostReviewedPlayers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/players/most-reviewed`);
      setMostReviewedPlayers(data);
    } catch (error) {
      console.log("Error when fetching most reviewed players");
    }
  };

  useEffect(() => {
    getRecentPlayers();
    getMostReviewedPlayers();
  }, []);

  return (
    <Box>
      <Typography sx={{ color: "white", textAlign: "center", margin: "10px" }}>
        Rate My Players
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "space-evenly",
        }}
      >
        <RecentReviews recentPlayers={recentPlayers} />
        <MostReviewedPlayers mostReviewedPlayers={mostReviewedPlayers} />
      </Box>
    </Box>
  );
}
