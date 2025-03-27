import React from "react";
import { useState, useEffect } from "react";
import { Typography, Box, Card, Pagination } from "@mui/material";
import axios from "axios";
import SingleReview from "./SingleReview";
import ReviewVote from "./ReviewVote";
import SortMenu from "./SortMenu";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function PlayerReviews({ playerId }) {
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);

  const [sortOptions, setSortOptions] = useState({
    sortBy: "newest",
    rating: "all",
  });

  const handleSortChange = (sortBy, rating) => {
    setSortOptions({ sortBy, rating });
  };

  const fetchPlayerReviews = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/reviews/${playerId}?page=${page}`,
        {
          params: {
            sortBy: sortOptions.sortBy,
            rating: sortOptions.rating,
          },
        }
      );

      setReviews(data.reviews);
      setTotalPages(data.totalPages);
      setTotalReviews(data.totalReviews);
    } catch (error) {
      console.log("Error when fetching reviews in PlayerReviews");
    }
  };

  useEffect(() => {
    if (playerId) {
      fetchPlayerReviews();
    }
  }, [playerId, sortOptions, page]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", sm: "700px" },
        maxWidth: { xs: "390px", sm: "700px" },
        mb: "10px",
      }}
    >
      <Box
        sx={{
          margin: "8px",
          maxWidth: "280px",
          width: "280px",
        }}
      >
        <SortMenu onSortChange={handleSortChange} />
      </Box>
      <Typography variant="body2" sx={{ color: "white", ml: "10px" }}>
        {totalReviews} Player {totalReviews == 1 ? "Review" : "Reviews"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "left", sm: "center" },
        }}
      >
        {reviews.map((review, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              mt: "10px",
              bgcolor: "#1a1a1a",
              padding: "2px",
              borderColor: "grey.500",
            }}
          >
            {/* Review Content on the Left */}
            <SingleReview review={review} />
            {/* Vote Component on the Right */}
            <ReviewVote reviewId={review.id} />
          </Card>
        ))}

        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#666", // Default color
            },
            "& .Mui-selected": {
              bgcolor: "#1976d2 !important", // Selected page color (blue)
              color: "white !important",
              fontWeight: "bold",
              borderRadius: "8px",
            },
            "& .MuiPaginationItem-root:hover": {
              bgcolor: "#e3f2fd", // Light blue on hover
            },
            mt: 2,
          }}
        />
      </Box>
    </Box>
  );
}
