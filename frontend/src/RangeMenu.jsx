import React, { useState } from "react";
import { FormControl, Select, MenuItem, Box } from "@mui/material";

const RangeMenu = ({ range, onRangeChange }) => {
  const handleRangeChange = (event) => {
    const newRange = event.target.value;
    onRangeChange(newRange);
  };

  return (
    <Box>
      {/* Range Dropdown */}
      <FormControl size="small">
        <Select
          value={range}
          onChange={handleRangeChange}
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
          <MenuItem value="1h">1 hour</MenuItem>
          <MenuItem value="1d">1 day</MenuItem>
          <MenuItem value="1w">1 week</MenuItem>
          <MenuItem value="1m">1 month</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default RangeMenu;
