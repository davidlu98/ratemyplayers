import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";

import PlayerReviews from "./PlayerReviews";
import RatingDistribution from "./RatingDistribution";
import PlayerInformation from "./PlayerInformation";
import OverallRating from "./OverallRating";

import PlayerPageSkeleton from "./PlayerPageSkeleton";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function PlayerPage({ user }) {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { region, name } = useParams(); // Get player name and region from URL

  const fetchPlayerData = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);

      const response = await axios.get(`${API_URL}/players/${region}/${name}`);

      if (response.status === 404) {
        throw new Error("Player not found.");
      }

      const { data } = response;

      setPlayerData(data);
    } catch (error) {
      setErrorMessage(
        <span>
          The player <strong>{name}</strong> was not found on {region}.
        </span>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, [name, region]);

  return (
    <>
      {loading ? (
        <PlayerPageSkeleton user={user} />
      ) : errorMessage ? (
        <Box sx={{ mt: "10px" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
          >
            Player Not Found
          </Typography>
          <Typography
            sx={{ color: "white", opacity: "0.8", textAlign: "center" }}
          >
            {errorMessage}
          </Typography>
        </Box>
      ) : isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
              <PlayerInformation playerData={playerData} />
              <OverallRating playerId={playerData.id} />
              <RatingDistribution playerId={playerData.id} />
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
                    component={Link}
                    to={`/write-review/${playerData.region}/${playerData.current_name}/${playerData.id}`}
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

          <PlayerReviews
            region={playerData.region}
            playerName={playerData.current_name}
            playerId={playerData.id}
          />
        </Box>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ marginTop: "10px", border: "1px solid #a0aec0" }}>
              <OverallRating playerId={playerData.id} />
              <div style={{ display: "flex" }}>
                <PlayerInformation playerData={playerData} />
                <RatingDistribution playerId={playerData.id} />
              </div>
            </div>
            <Tooltip
              title={!user ? "Please log in to write a review" : ""}
              arrow
              disableHoverListener={!!user} // Disable the tooltip if the button is enabled
            >
              <span>
                <Button
                  component={Link}
                  to={`/write-review/${playerData.region}/${playerData.current_name}/${playerData.id}`}
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
          <PlayerReviews
            user={user}
            region={playerData.region}
            playerName={playerData.current_name}
            playerId={playerData.id}
          />
        </div>
      )}
    </>
  );
}
