import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import RecentReviews from "./RecentReviews";
import MostReviewedPlayers from "./MostReviewedPlayers";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [mostReviewedPlayers, setMostReviewedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const recentPlayers = await axios.get(`${API_URL}/players/recent`);
      const mostReviewedPlayers = await axios.get(
        `${API_URL}/players/most-reviewed`
      );

      setRecentPlayers(recentPlayers.data);
      setMostReviewedPlayers(mostReviewedPlayers.data);

      setLoading(false);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data); // Display server error
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  return (
    <>
      {loading ? (
        <Box sx={{ mt: "10px", textAlign: "center" }}>
          <Typography sx={{ color: "white" }}>Loading...</Typography>
        </Box>
      ) : (
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
          <Box sx={{ mt: "10px", textAlign: "center" }}>
            <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
