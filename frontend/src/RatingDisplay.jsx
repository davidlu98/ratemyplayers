import React from "react";
import { Box, Typography } from "@mui/material";

export default function RatingDisplay({ rating, totalRatings }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#1a1a1a",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        padding: "10px",
        maxWidth: "627px",
        width: "627px",
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontWeight: "bold", display: "inline", color: "white" }}
      >
        {rating}
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
          fontWeight: "bold",
          marginTop: "8px",
          color: "white",
          opacity: "0.8",
        }}
      >
        Overall Rating Based on {""}
        <span style={{ textDecoration: "underline" }}>
          {totalRatings} {totalRatings == 1 ? "rating" : "ratings"}
        </span>
      </Typography>
    </Box>
  );
}
