import React from "react";
import { Typography, Box } from "@mui/material";

const RatingDistribution = ({ ratingCounts }) => {
  const maxCount = Math.max(...Object.values(ratingCounts), 1); // Prevent division by zero

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "325px",
        // width: "100%",
        bgcolor: "#1a1a1a",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        padding: "16px",
        maxWidth: "325px",
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
