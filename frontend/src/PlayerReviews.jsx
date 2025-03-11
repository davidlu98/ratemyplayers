import React from "react";
import SingleReview from "./SingleReview";
import { Typography, Box, Card } from "@mui/material";

export default function PlayerReviews({ reviews }) {
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

      <Box sx={{ mb: "10px" }}>
        {reviews.map((review, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              marginTop: "10px",
              width: "100%", // Ensure full width,
              display: "flex",
              justifyContent: "flex-start", // Align content properly
              backgroundColor: "#1a1a1a",
            }}
          >
            <SingleReview review={review} />
          </Card>
        ))}
      </Box>
    </Box>
  );
}
