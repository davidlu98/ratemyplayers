import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import axios from "axios";

import PlayerReviews from "./PlayerReviews";
import RatingDistribution from "./RatingDistribution";
import PlayerInformation from "./PlayerInformation";
import OverallRating from "./OverallRating";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function PlayerPage() {
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
        <div>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            Player Not Found
          </Typography>
          <Typography sx={{ color: "white", opacity: "0.8" }}>
            The player <strong>{name}</strong> was not found on {region}.
          </Typography>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ marginTop: "10px" }}>
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
          <div>
            <PlayerReviews playerId={playerData.id} />
          </div>
        </div>
      )}
    </>
  );
}
