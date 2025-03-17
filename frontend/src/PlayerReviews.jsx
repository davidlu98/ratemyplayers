import React from "react";
import SingleReview from "./SingleReview";
import { Typography, Box, Card } from "@mui/material";
import ReviewVote from "./ReviewVote";
import SortMenu from "./SortMenu";

export default function PlayerReviews({ reviews, setSortType }) {
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

      <SortMenu setSortType={setSortType} />

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
