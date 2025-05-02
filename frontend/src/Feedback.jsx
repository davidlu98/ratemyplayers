import React from "react";
import { useState } from "react";
import axios from "axios";
import { Typography, Box, TextField, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MAX_FEEDBACK_SIZE = 300;

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const submitFeedback = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    const token = window.localStorage.getItem("token");

    try {
      await axios.post(
        `${API_URL}/feedback/`,
        {
          feedback,
        },
        { headers: { authorization: token } }
      );
      navigate("/");
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
        onSubmit={submitFeedback}
        sx={{
          maxWidth: { xs: "340px", sm: "600px" },
          width: "100%",
          p: 2,
          boxShadow: 3,
          bgcolor: "#171717",
          border: "1px solid #a0aec0",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: "10px" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
            Give Feedback
          </Typography>
        </Box>

        {/* TextField for Feedback */}
        <TextField
          label="Give some feedback"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={feedback}
          onChange={(e) => {
            const input = e.target.value;
            const regex = /^[a-zA-Z0-9,.!'" ]*$/;

            if (input.length <= MAX_FEEDBACK_SIZE && regex.test(input)) {
              setFeedback(input);
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
          {feedback.length}/{MAX_FEEDBACK_SIZE}
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
            Submit Feedback
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: "10px" }}>
        <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
      </Box>
    </Box>
  );
}
