import React from "react";

import { Box, Button, Tooltip, useMediaQuery, useTheme } from "@mui/material";

import OverallRatingSkeleton from "./OverallRatingSkeleton";
import PlayerInformationSkeleton from "./PlayerInformationSkeleton";
import RatingDistributionSkeleton from "./RatingDistributionSkeleton";
import PlayerReviewsSkeleton from "./PlayerReviewsSkeleton";

export default function PlayerPageSkeleton({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
              width: { xs: "100%", sm: "283px" },
              maxWidth: "374px",
            }}
          >
            <Box sx={{ border: "1px solid #a0aec0" }}>
              <PlayerInformationSkeleton />
              <OverallRatingSkeleton />
              <RatingDistributionSkeleton />
            </Box>
            <Box>
              <Tooltip
                title={!user ? "Please log in to write a review" : ""}
                arrow
                disableHoverListener={!!user}
                enterTouchDelay={0}
                leaveTouchDelay={3000}
              >
                <span>
                  <Button
                    variant="contained"
                    disabled={!user}
                    sx={{
                      bgcolor: "#ff1744",
                      textTransform: "none",
                      mt: "12px",
                      "&.Mui-disabled": {
                        background: "#ff1744",
                        color: "white",
                        opacity: 0.5,
                      },
                    }}
                  >
                    Write a Review
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>

          <PlayerReviewsSkeleton />
        </Box>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
          }}
        >
          <div>
            <div style={{ marginTop: "10px", border: "1px solid #a0aec0" }}>
              <OverallRatingSkeleton />
              <div style={{ display: "flex" }}>
                <PlayerInformationSkeleton />
                <RatingDistributionSkeleton />
              </div>
            </div>
            <Tooltip
              title={!user ? "Please log in to write a review" : ""}
              arrow
              disableHoverListener={!!user} // Disable the tooltip if the button is enabled
            >
              <span>
                <Button
                  variant="contained"
                  disabled={!user}
                  sx={{
                    bgcolor: "#ff1744",
                    textTransform: "none",
                    mt: "12px",
                    "&.Mui-disabled": {
                      background: "#ff1744",
                      color: "white",
                      opacity: 0.5,
                    },
                  }}
                >
                  Write a Review
                </Button>
              </span>
            </Tooltip>
          </div>
          <PlayerReviewsSkeleton />
        </div>
      )}
    </>
  );
}
