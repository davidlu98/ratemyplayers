import React from "react";
import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ratingLabels = {
  5: "Awesome",
  4: "Great",
  3: "Good",
  2: "OK",
  1: "Awful",
};

const ratingColors = {
  5: "#007bff", // Blue (Awesome)
  4: "#28a745", // Green (Great)
  3: "#ffc107", // Yellow (Good)
  2: "#fd7e14", // Orange (OK)
  1: "#dc3545", // Red (Awful)
};

const RatingDistribution = ({ playerId }) => {
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const [maxCount, setMaxCount] = useState(0);

  const fetchPlayerReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews/${playerId}/all`);

      const newCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      data.forEach((review) => {
        if (newCounts.hasOwnProperty(review.rating)) {
          newCounts[review.rating] += 1;
        }
      });

      setRatingCounts(newCounts);
      setMaxCount(Math.max(...Object.values(newCounts), 1));
    } catch (error) {
      console.log("Error when fetching reviews in RatingDistribution");
    }
  };

  useEffect(() => {
    fetchPlayerReviews();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#222222",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        padding: { xs: "8px", sm: "16px" },
        width: { xs: "100%", sm: "325px" },
        maxWidth: { xs: "355px" },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 2, color: "white" }}
      >
        Rating Distribution
      </Typography>

      <Box sx={{ width: "300px", color: "white" }}>
        {Object.entries(ratingCounts)
          .sort(([a], [b]) => b - a) // Sort from 5 to 1
          .map(([rating, count]) => {
            const normalizedWidth = (count / maxCount) * 100; // Normalize bars

            return (
              <Box
                key={rating}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1.5}
                width="100%"
              >
                {/* Label */}
                <Typography
                  variant="body1"
                  sx={{ minWidth: 90, textAlign: "right", pr: 1 }}
                >
                  <span style={{ opacity: 0.8 }}>{ratingLabels[rating]}</span>{" "}
                  <strong>{rating}</strong>
                </Typography>

                {/* Bar */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 5,
                    height: 12,
                    mx: 1,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${normalizedWidth}%`,
                      backgroundColor: ratingColors[rating],
                      height: "100%",
                      borderRadius: 5,
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </Box>

                {/* Count */}
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", opacity: 0.8 }}
                >
                  {count}
                </Typography>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

export default RatingDistribution;
