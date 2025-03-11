import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import SingleReview from "./SingleReview";
import CreateReview from "./CreateReview";

import {
  Typography,
  Box,
  Rating,
  Card,
  TextField,
  Button,
} from "@mui/material";

export default function PlayerReviews({
  user,
  playerId,
  setRatingCounts,
  setAverageRating,
  reviews,
  setReviews,
}) {
  const filledStar = "/filled-star.jpg";

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);

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

  const submitReview = async (event) => {
    event.preventDefault();

    const token = window.localStorage.getItem("token");

    if (token) {
      if (comment.trim() !== "") {
        console.log("submitted review:", comment);
        try {
          await axios.post(
            "http://localhost:3000/reviews/",
            {
              player_id: playerId,
              rating: rating,
              comment: comment.trim(),
            },
            { headers: { authorization: token } }
          );
          setComment("");
          setRating(3);

          fetchPlayerReviews();
        } catch (error) {
          console.log("Error when submitting review");
        }
      }
    }
  };

  useEffect(() => {
    fetchPlayerReviews();
  }, []);

  return (
    <>
      {user && (
        <Box
          component="form"
          onSubmit={submitReview}
          sx={{
            maxWidth: 400,
            mx: "auto",
            mt: 4,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Rate Your Experience
          </Typography>

          <Rating
            name="custom-images"
            value={rating}
            onChange={(_, newValue) => setRating(newValue >= 1 ? newValue : 1)}
            size="large"
            icon={
              <img
                src={filledStar}
                alt="filled-star"
                style={{ width: 24, height: 24 }}
              />
            }
            emptyIcon={
              <img
                src={filledStar}
                alt="empty-star"
                style={{ width: 24, height: 24, opacity: 0.3 }}
              />
            }
          />

          {/* Display Selected Rating */}
          <Typography sx={{ mt: 1, mb: 2 }}>
            Your Rating: {rating || "No rating yet"}
          </Typography>

          {/* TextField for Review */}
          <TextField
            label="Write a review"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" fullWidth>
            Submit Feedback
          </Button>
        </Box>
      )}

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
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
