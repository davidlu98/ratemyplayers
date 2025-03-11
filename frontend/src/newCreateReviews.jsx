import React from "react";
import { useState } from "react";
import axios from "axios";
import { Typography, Box, Rating, TextField, Button } from "@mui/material";

const filledStar = "/filled-star.jpg";

export default function CreateReview({ user, fetchPlayerReviews }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);

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

  return (
    <div>
      {" "}
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
    </div>
  );
}
