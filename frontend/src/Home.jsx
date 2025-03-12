import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import PopularPlayers from "./PopularPlayers";
import MostReviewedPlayers from "./MostReviewedPlayers";

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [mostReviewedPlayers, setMostReviewedPlayers] = useState([]);
  const [popularPlayers, setPopularPlayers] = useState([]);

  const getReviews = async () => {
    try {
      const { data } = await axios.get(
        "https://ywratemyplayersbackend2025.onrender.com/reviews/"
      );
      // console.log(data);

      // Group reviews by player.current_name
      const groupedReviews = data.reduce((acc, review) => {
        const { current_name, avatar, region, server, level, job } =
          review.player;

        if (!acc[current_name]) {
          acc[current_name] = {
            playerInfo: { current_name, avatar, region, server, level, job },
            reviews: [],
          };
        }

        acc[current_name].reviews.push(review);
        return acc;
      }, {});

      // Get Top n reviews
      const getTopNReviews = (groupedReviews, n) => {
        return Object.fromEntries(
          Object.entries(groupedReviews)
            .sort((a, b) => b[1].reviews.length - a[1].reviews.length) // Sort descending
            .slice(0, n)
        );
      };

      const getPopularPlayers = (reviews) => {
        const now = new Date();
        const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const uniquePlayers = new Map();

        for (const review of reviews) {
          const reviewDate = new Date(review.created_at);

          if (reviewDate >= cutoff) {
            const playerId = review.player.id;
            if (!uniquePlayers.has(playerId)) {
              uniquePlayers.set(playerId, review.player);
            }
            if (uniquePlayers.size === 10) break;
          }
        }

        return Array.from(uniquePlayers.values());
      };

      setReviews(data);
      setMostReviewedPlayers(getTopNReviews(groupedReviews, 10));
      setPopularPlayers(getPopularPlayers(data));
    } catch (error) {
      console.log("Error when fetching all reviews");
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <Box>
      <Typography sx={{ color: "white", textAlign: "center", margin: "10px" }}>
        Rate My Players
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "space-evenly",
        }}
      >
        <PopularPlayers popularPlayers={popularPlayers} />
        <MostReviewedPlayers mostReviewedPlayers={mostReviewedPlayers} />
      </Box>
    </Box>
  );
}
