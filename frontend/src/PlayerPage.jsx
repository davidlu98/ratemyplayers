import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";

import PlayerReviews from "./PlayerReviews";
import RatingDistribution from "./RatingDistribution";
import PlayerInformation from "./PlayerInformation";
import OverallRating from "./OverallRating";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function PlayerPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { region, name } = useParams(); // Get player name and region from URL
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlayerData = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(`${API_URL}/players/${region}/${name}`);

      if (response.status === 404) {
        throw new Error("Player not found.");
      }

      const { data } = response;

      // console.log(data);
      setPlayerData(data);
    } catch (error) {
      setError(`The player **${name}** was not found on ${region}.`);
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
        <p>Loading...</p>
      ) : error ? (
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
            The player <strong>{name}</strong> was not found on {region}.
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
              <Button
                component={Link}
                to={`/write-review/${playerData.region}/${playerData.current_name}/${playerData.id}`}
                variant="contained"
                sx={{
                  backgroundColor: "#ff1744",
                  textTransform: "none",
                  // margin: "8px 0px 0px 0px",
                  mt: "8px",
                }}
              >
                Write a Review
              </Button>
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
            <Button
              component={Link}
              to={`/write-review/${playerData.region}/${playerData.current_name}/${playerData.id}`}
              variant="contained"
              sx={{
                backgroundColor: "#ff1744",
                textTransform: "none",
                mt: "12px",
              }}
            >
              Write a review
            </Button>
          </div>
          <PlayerReviews
            region={playerData.region}
            playerName={playerData.current_name}
            playerId={playerData.id}
          />
        </div>
      )}
    </>
  );
}
