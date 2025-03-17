import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

export default function ReviewVote({ reviewId }) {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  const [userVote, setUserVote] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchVotes = async () => {
    try {
      const reponse = await axios.get(`${API_URL}/reviews/${reviewId}/votes`);

      setUpvotes(reponse.data.upvotes);
      setDownvotes(reponse.data.downvotes);

      const token = window.localStorage.getItem("token");

      if (token) {
        const response = await axios.get(`${API_URL}/vote/${reviewId}`, {
          headers: { authorization: token },
        });
        setUserVote(response.data.value);
      }
    } catch (error) {
      console.log("Error when fetching votes");
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [reviewId]);

  const handleVote = async (value) => {
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        await axios.post(
          `${API_URL}/vote/`,
          {
            review_id: reviewId,
            value: value,
          },
          { headers: { authorization: token } }
        );
        fetchVotes();
      } catch (error) {
        console.log("Error when handling vote");
      }
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Button
        sx={{
          minWidth: "auto",
          color: userVote === 1 ? "red" : "#aaa",
          "&:hover": { color: "red" },
        }}
        onClick={() => handleVote(1)}
      >
        <ThumbUpIcon></ThumbUpIcon>
      </Button>

      <Typography
        sx={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: "0.8",
        }}
      >
        {upvotes}
      </Typography>
      <Button
        sx={{
          minWidth: "auto",
          color: userVote === -1 ? "#7193ff" : "#aaa",
          "&:hover": { color: "#7193ff" },
        }}
        onClick={() => handleVote(-1)}
      >
        <ThumbDownIcon></ThumbDownIcon>
      </Button>
      <Typography
        sx={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: "0.8",
        }}
      >
        {downvotes}
      </Typography>
    </Box>
  );
}
