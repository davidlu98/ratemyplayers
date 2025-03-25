import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function RatingDisplay({ playerId }) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const fetchPlayerReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews/${playerId}/all`);

      let totalRating = 0;

      data.forEach((review) => {
        totalRating += review.rating;
      });

      setReviewCount(data.length);
      setAverageRating(data.length > 0 ? totalRating / data.length : 0);
    } catch (error) {
      console.log("Error when fetching reviews in OverallRating");
    }
  };

  useEffect(() => {
    fetchPlayerReviews();
  }, []);

  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#1a1a1a",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        padding: "10px",
        maxWidth: "660px",
        width: "660px",
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontWeight: "bold", display: "inline", color: "white" }}
      >
        {averageRating.toFixed(1)}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "white",
          opacity: "0.8",
          display: "inline",
          marginLeft: "4px",
          position: "relative",
          top: "-25px",
          fontSize: "1.2rem",
        }}
      >
        /5
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "white",
          opacity: "0.8",
        }}
      >
        Overall Rating Based on {""}
        <span style={{ textDecoration: "underline" }}>
          {reviewCount} {reviewCount == 1 ? "rating" : "ratings"}
        </span>
      </Typography>
    </Box>
  );
}
