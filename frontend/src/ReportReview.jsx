import React from "react";
import { useState } from "react";
import axios from "axios";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function ReportReview() {
  const navigate = useNavigate();

  const { region, playerName, reviewId } = useParams();
  const [reportType, setReportType] = useState("Hate Speech");
  const [reason, setReason] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const submitReview = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const token = window.localStorage.getItem("token");

    try {
      await axios.post(
        `${API_URL}/reports/`,
        {
          review_id: reviewId,
          type: reportType,
          reason,
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
            Report a Review
          </Typography>
        </Box>

        {/* Report Type Dropdown */}
        <FormControl size="small" sx={{ mb: "10px" }}>
          <Select
            value={reportType}
            onChange={(event) => setReportType(event.target.value)}
            sx={{
              color: "white", // Selected text color
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff1744",
              }, // Default border
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff8a80",
              }, // Hover border
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff1744",
              }, // Focus border
              "& .MuiSvgIcon-root": { color: "#ff1744" }, // Arrow icon color
            }}
          >
            <MenuItem value="Hate Speech">Hate Speech</MenuItem>
            <MenuItem value="Harassment/Bullying">Harassment/Bullying</MenuItem>
            <MenuItem value="Spam/Advertisement">Spam/Advertisement</MenuItem>
            <MenuItem value="Inappropriate Content">
              Inappropriate Content
            </MenuItem>
            <MenuItem value="Other">Other (Please Specify)</MenuItem>
          </Select>
        </FormControl>

        {/* TextField for Report */}
        <TextField
          label="Reason for reporting"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
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
            mb: "16px",
          }}
        />

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
            Submit Report
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: "10px" }}>
        <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
      </Box>
    </Box>
  );
}
