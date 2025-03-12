import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography } from "@mui/material";

import PlayerReviews from "./PlayerReviews";
import RatingDistribution from "./RatingDistribution";
import PlayerInformation from "./PlayerInformation";
import RatingDisplay from "./RatingDisplay";
import CreateReview from "./CreateReview";

export default function PlayerPage({ user }) {
  const { region, name } = useParams(); // Get player name and region from URL
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const fetchPlayerData = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(
        `https://ywratemyplayersbackend2025.onrender.com/players/${region}/${name}`
      );

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

  const fetchPlayerReviews = async () => {
    try {
      const { data } = await axios.get(
        `https://ywratemyplayersbackend2025.onrender.com/reviews/${playerData.id}`
      );
      // console.log(data);

      // Reset rating counts before recalculating
      const newCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      let totalRating = 0;

      data.forEach((review) => {
        if (newCounts.hasOwnProperty(review.rating)) {
          newCounts[review.rating] += 1;
        }
        totalRating += review.rating;
      });

      // Calculate average rating & set new state values
      setRatingCounts(newCounts);
      setAverageRating(data.length > 0 ? totalRating / data.length : 0);
      setReviews(data);
    } catch (error) {
      console.log("Error when fetching reviews");
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, [name, region]);

  useEffect(() => {
    if (playerData?.id) {
      fetchPlayerReviews();
    }
  }, [playerData]);

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
            justifyContent: "space-evenly",
          }}
        >
          <div>
            <div>
              <Box
                sx={{
                  textAlign: "center",
                  marginTop: "16px",
                  backgroundColor: "#1a1a1a",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
                  padding: "10px",
                  maxWidth: "627px",
                  width: "627px",
                  marginBottom: "10px",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  Player Overview
                </Typography>
              </Box>
              <RatingDisplay
                rating={averageRating.toFixed(1)}
                totalRatings={reviews.length}
              />
              <div style={{ display: "flex" }}>
                <PlayerInformation playerData={playerData} />
                <RatingDistribution ratingCounts={ratingCounts} />
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <CreateReview
                user={user}
                fetchPlayerReviews={fetchPlayerReviews}
                playerId={playerData.id}
              />
            </div>
          </div>
          <div>
            <PlayerReviews reviews={reviews} />
          </div>
        </div>
      )}
    </>
  );
}
