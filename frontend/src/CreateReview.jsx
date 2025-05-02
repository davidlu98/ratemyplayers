import React from "react";
import { useState } from "react";
import axios from "axios";
import { Typography, Box, Rating, TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const filledStar = "/filled-star2.png";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ratingLabels = {
  5: "Awesome",
  4: "Great",
  3: "Good",
  2: "OK",
  1: "Awful",
};

const MAX_COMMENT_SIZE = 200;

export default function CreateReview() {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const { region, playerName, playerId } = useParams();

  const submitReview = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    const token = window.localStorage.getItem("token");

    try {
      await axios.post(
        `${API_URL}/reviews/`,
        {
          player_id: playerId,
          rating,
          comment,
        },
        { headers: { authorization: token } }
      );
      navigate(`/players/${region}/${playerName}`);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data); // Display server error
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: "16px",
      }}
    >
      <Box
        component="form"
        onSubmit={submitReview}
        sx={{
          maxWidth: { xs: "360px", sm: "600px" },
          width: "100%",
          p: 2,
          boxShadow: 3,
          bgcolor: "#171717",
          border: "1px solid #a0aec0",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
            Rate Your Experience
          </Typography>
        </Box>

        {/* Select Rating */}
        <Box sx={{ display: "flex", mb: "10px" }}>
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
          onChange={(e) => {
            const input = e.target.value;
            const regex = /^[a-zA-Z0-9,.!'" ]*$/;

            if (input.length <= MAX_COMMENT_SIZE && regex.test(input)) {
              setComment(input);
            }
          }}
          sx={{
            bgcolor: "#1f1f1f",
            "& .MuiInputLabel-root": { color: "white", opacity: 0.6 },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#ff1744" }, // Default border color
              "&:hover fieldset": { borderColor: "#ff8a80" }, // Hover border color
              "&.Mui-focused fieldset": { borderColor: "#ff1744" }, // Focused border color
            },
            "& .MuiInputBase-input": { color: "white" }, // Input text color (for single-line)
            "& .MuiInputBase-root textarea": { color: "white" }, // Textarea text color (for multiline)
            mb: "2px",
          }}
        />
        <Typography variant="body2" sx={{ color: "white", textAlign: "right" }}>
          {comment.length}/{MAX_COMMENT_SIZE}
        </Typography>

        {/* Submit Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            type="submit"
            sx={{
              bgcolor: "#ff1744",
              textTransform: "none",
              color: "white",
            }}
          >
            Submit Review
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: "10px" }}>
        <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
      </Box>
    </Box>
  );
}
