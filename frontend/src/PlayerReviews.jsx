import React from "react";
import { useState, useEffect } from "react";
import { Typography, Box, Card } from "@mui/material";
import axios from "axios";
import SingleReview from "./SingleReview";
import ReviewVote from "./ReviewVote";
import SortMenu from "./SortMenu";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function PlayerReviews({ playerId }) {
  const [reviews, setReviews] = useState([]);

  const [sortOptions, setSortOptions] = useState({
    sortBy: "newest",
    rating: "all",
  });

  const handleSortChange = (sortBy, rating) => {
    setSortOptions({ sortBy, rating });
  };

  const fetchPlayerReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews/${playerId}`, {
        params: {
          sortBy: sortOptions.sortBy,
          rating: sortOptions.rating,
        },
      });

      // console.log(data);

      setReviews(data);
    } catch (error) {
      console.log("Error when fetching reviews in PlayerReviews");
    }
  };

  useEffect(() => {
    if (playerId) {
      fetchPlayerReviews();
    }
  }, [playerId, sortOptions]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          marginTop: "16px",
          backgroundColor: "#1a1a1a",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
          padding: "10px",
          maxWidth: "660px",
          width: "660px",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", color: "white" }}>
          Player Reviews
        </Typography>
      </Box>

      <SortMenu onSortChange={handleSortChange} />

      <Box sx={{ mb: "10px" }}>
        {reviews.map((review, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <Card
              variant="outlined"
              sx={{
                marginTop: "10px",
                width: "100%", // Ensure full width,
                display: "flex",
                justifyContent: "flex-start", // Align content properly
                backgroundColor: "#1a1a1a",
                padding: "10px",
                flexDirection: "column",
              }}
            >
              {/* Review Content on the Left */}
              <SingleReview review={review} />
              {/* Vote Component on the Right */}
              <ReviewVote reviewId={review.id} />
            </Card>
          </div>
        ))}
      </Box>
    </Box>
  );
}
