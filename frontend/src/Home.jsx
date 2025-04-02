import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import RecentReviews from "./RecentReviews";
import MostReviewedPlayers from "./MostReviewedPlayers";

import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [mostReviewedPlayers, setMostReviewedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  return (
    <>
      {loading ? (
        <Typography sx={{ color: "white", textAlign: "center", mt: "10px" }}>
          Loading...
        </Typography>
      ) : errorMessage ? (
        <Box sx={{ mt: "10px", textAlign: "center" }}>
          <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
          >
            <RecentReviews recentPlayers={recentPlayers} />
            <MostReviewedPlayers mostReviewedPlayers={mostReviewedPlayers} />
          </Box>
          {!isMobile && (
            <Box>
              <Button
                component={Link}
                to="/feedback"
                sx={{
                  color: "white",
                  bgcolor: "#ff1744",
                  mb: "14px",
                  textTransform: "none",
                }}
              >
                Feedback
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
