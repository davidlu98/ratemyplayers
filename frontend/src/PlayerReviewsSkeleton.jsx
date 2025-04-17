import React from "react";
import { useState } from "react";

import { Box, Typography, Pagination } from "@mui/material";

import SortMenu from "./SortMenu";

export default function PlayerReviewsSkeleton() {
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);

  const [sortOptions, setSortOptions] = useState({
    sortBy: "newest",
    rating: "all",
  });

  const handleSortChange = (sortBy, rating) => {
    setSortOptions({ sortBy, rating });
  };

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
          alignItems: "center",
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
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
