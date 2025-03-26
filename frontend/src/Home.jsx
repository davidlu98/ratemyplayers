import React from "react";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import RecentReviews from "./RecentReviews";
import MostReviewedPlayers from "./MostReviewedPlayers";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [mostReviewedPlayers, setMostReviewedPlayers] = useState([]);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        mt: 2,
      }}
    >
      <RecentReviews recentPlayers={recentPlayers} />
      <MostReviewedPlayers mostReviewedPlayers={mostReviewedPlayers} />
    </Box>
  );
}
