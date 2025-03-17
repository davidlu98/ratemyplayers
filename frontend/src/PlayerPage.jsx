import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import { Button, Box, Typography } from "@mui/material";

import PlayerReviews from "./PlayerReviews";
import RatingDistribution from "./RatingDistribution";
import PlayerInformation from "./PlayerInformation";
import RatingDisplay from "./RatingDisplay";

export default function PlayerPage() {
  const { region, name } = useParams(); // Get player name and region from URL
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("newest");

  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

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

  const fetchPlayerReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews/${playerData.id}`);
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

  // useEffect(() => {
  //   console.log("sort type is:", sortType);
  // }, [sortType]);

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
            <Button
              component={Link}
              to={`/write-review/${playerData.region}/${playerData.current_name}/${playerData.id}`}
              variant="contained"
              sx={{
                backgroundColor: "#ff1744",
                textTransform: "none",
                mt: "10px",
              }}
            >
              Write a review
            </Button>
          </div>
          <div>
            <PlayerReviews reviews={reviews} setSortType={setSortType} />
          </div>
        </div>
      )}
    </>
  );
}
