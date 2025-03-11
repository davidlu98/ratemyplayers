import React from "react";
import { useState } from "react";
import axios from "axios";
import { Typography, Box, Rating, TextField, Button } from "@mui/material";

const filledStar = "/filled-star2.png";

export default function CreateReview({ user, fetchPlayerReviews, playerId }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);

  const ratingLabels = {
    5: "Awesome",
    4: "Great",
    3: "Good",
    2: "OK",
    1: "Awful",
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

  return (
    <div>
      {user && (
        <Box
          component="form"
          onSubmit={submitReview}
          sx={{
            maxWidth: 600,
            p: 3,
            boxShadow: 3,
            bgcolor: "#1a1a1a",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Rate Your Experience
            </Typography>
          </Box>

          {/* Select Rating */}
          <Box sx={{ display: "flex", mb: "10px" }}>
            <Rating
              name="custom-images"
              value={rating}
              onChange={(_, newValue) =>
                setRating(newValue >= 1 ? newValue : 1)
              }
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
                  style={{ width: 24, height: 24, opacity: 0.4 }}
                />
              }
            />
            <Typography sx={{ ml: "8px", opacity: 0.8, color: "white" }}>
              {ratingLabels[rating]}
            </Typography>
          </Box>

          {/* TextField for Review */}
          <TextField
            label="Write a review"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": { color: "#ff1744" }, // Label color
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff1744" }, // Default border color
                "&:hover fieldset": { borderColor: "#ff8a80" }, // Hover border color
                "&.Mui-focused fieldset": { borderColor: "#ff1744" }, // Focused border color
              },
              "& .MuiInputBase-input": { color: "white" }, // Input text color (for single-line)
              "& .MuiInputBase-root textarea": { color: "white" }, // Textarea text color (for multiline)
              mb: "16px",
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "#ff1744" }}
          >
            Submit Review
          </Button>
        </Box>
      )}
    </div>
  );
}
