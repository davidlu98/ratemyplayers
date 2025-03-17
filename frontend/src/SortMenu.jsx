import React from "react";
import { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

export default function SortMenu({ setSortType }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (sortType) => {
    setAnchorEl(null);
    if (sortType) setSortType(sortType);
  };

  return (
    <div style={{}}>
      <Button
        onClick={handleClick}
        startIcon={<SortIcon />}
        sx={{ color: "white", textTransform: "none" }}
      >
        Sort by
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "sort-button",
        }}
      >
        <MenuItem onClick={() => handleClose("top")}>Top comments</MenuItem>
        <MenuItem onClick={() => handleClose("newest")}>Newest first</MenuItem>
      </Menu>
    </div>
  );
}
