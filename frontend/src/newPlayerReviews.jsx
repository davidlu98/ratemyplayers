import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import CreateReview from "./CreateReview";
import SingleReview from "./SingleReview";

import { Typography, Box, Card } from "@mui/material";

export default function PlayerReviews({
  user,
  playerId,
  setRatingCounts,
  setAverageRating,
  reviews,
  setReviews,
}) {
  const fetchPlayerReviews = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/reviews/${playerId}`
      );
      console.log(data);

      // Reset rating counts before recalculating
      const newCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      let totalRating = 0;

      data.forEach((review) => {
        if (newCounts.hasOwnProperty(review.rating)) {
          newCounts[review.rating] += 1;
        }
        totalRating += review.rating;
      });

      // Calculate average rating & set new state values
      setRatingCounts(newCounts);
      setAverageRating(data.length > 0 ? totalRating / data.length : 0);
      setReviews(data);
    } catch (error) {
      console.log("Error when fetching reviews");
    }
  };

  useEffect(() => {
    fetchPlayerReviews();
  }, []);

  return (
    <>
      <CreateReview user={user} fetchPlayerReviews={fetchPlayerReviews} />

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", marginTop: "12px" }}>
          Player Reviews
        </Typography>
        {reviews.map((review, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              marginTop: "20px",
              padding: "10px",
              maxWidth: "800px", // Set a reasonable max width <--
              width: "100%", // Ensure full width,
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "flex-start", // Align content properly
              backgroundColor: "#1a1a1a",
            }}
          >
            <SingleReview review={review} />
          </Card>
        ))}
      </Box>
    </>
  );
}
