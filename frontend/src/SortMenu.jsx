import React, { useState } from "react";
import { FormControl, Select, MenuItem, Box } from "@mui/material";

const SortMenu = ({ onSortChange }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [ratingFilter, setRatingFilter] = useState("all");

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    onSortChange(event.target.value, ratingFilter);
  };

  const handleRatingChange = (event) => {
    setRatingFilter(event.target.value);
    onSortChange(sortBy, event.target.value);
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mt: "6px" }}>
      {/* Sorting Dropdown */}
      <FormControl size="small">
        <Select
          value={sortBy}
          onChange={handleSortChange}
          sx={{
            color: "white", // Selected text color
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff1744",
            }, // Default border
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff8a80",
            }, // Hover border
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff1744",
            }, // Focus border
            "& .MuiSvgIcon-root": { color: "#ff1744" }, // Arrow icon color
          }}
        >
          <MenuItem value="newest">Newest first</MenuItem>
          <MenuItem value="oldest">Oldest first</MenuItem>
          <MenuItem value="most_upvotes">Most upvotes</MenuItem>
          <MenuItem value="most_downvotes">Most downvotes</MenuItem>
        </Select>
      </FormControl>

      {/* Rating Filter Dropdown */}
      <FormControl size="small">
        <Select
          value={ratingFilter}
          onChange={handleRatingChange}
          sx={{
            color: "white", // Selected text color
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff1744",
            }, // Default border
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff8a80",
            }, // Hover border
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff1744",
            }, // Focus border
            "& .MuiSvgIcon-root": { color: "#ff1744" }, // Arrow icon color
          }}
        >
          <MenuItem value="all">All ratings</MenuItem>
          <MenuItem value="5">5 stars</MenuItem>
          <MenuItem value="4">4 stars</MenuItem>
          <MenuItem value="3">3 stars</MenuItem>
          <MenuItem value="2">2 stars</MenuItem>
          <MenuItem value="1">1 star</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortMenu;
