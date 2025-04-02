import * as React from "react";
import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const filledStar = "/filled-star2.png";

export default function ButtonAppBar({ user, logout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#171717" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex" }}>
            <img
              src={filledStar}
              alt="star"
              style={{
                width: "25px",
                height: "25px",
                padding: "2px",
                pointerEvents: "none",
              }}
            />
            <Typography variant="h6">
              <Link
                to="/"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                MapleReviews
              </Link>
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiMenu-paper": {
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    border: "1px solid #a0aec0",
                  },
                }}
              >
                <MenuItem>
                  <SearchBar
                    isMobile={isMobile}
                    handleMenuClose={handleMenuClose}
                  />
                </MenuItem>
                {user ? (
                  <Box>
                    <MenuItem
                      component={Link}
                      to="/account"
                      onClick={handleMenuClose}
                      sx={{ bgcolor: "#222222" }}
                    >
                      Account
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/feedback"
                      onClick={handleMenuClose}
                      sx={{ bgcolor: "#222222" }}
                    >
                      Feedback
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        logout();
                      }}
                      sx={{ bgcolor: "#222222" }}
                    >
                      Sign Out
                    </MenuItem>
                  </Box>
                ) : (
                  <Box>
                    <MenuItem
                      component={Link}
                      to="/register"
                      onClick={handleMenuClose}
                      sx={{ bgcolor: "#222222" }}
                    >
                      Sign Up
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/feedback"
                      onClick={handleMenuClose}
                      sx={{ bgcolor: "#222222" }}
                    >
                      Feedback
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/login"
                      onClick={handleMenuClose}
                      sx={{ bgcolor: "#222222" }}
                    >
                      Log In
                    </MenuItem>
                  </Box>
                )}
              </Menu>
            </>
          ) : (
            <>
              <SearchBar
                isMobile={isMobile}
                handleMenuClose={handleMenuClose}
              />
              {user ? (
                <Box>
                  <Button
                    component={Link}
                    to="/account"
                    color="inherit"
                    sx={{
                      bgcolor: "#ff1744",
                      m: "4px",
                      textTransform: "none",
                    }}
                  >
                    Account
                  </Button>
                  <Button
                    color="inherit"
                    sx={{
                      bgcolor: "#ff1744",
                      m: "4px",
                      textTransform: "none",
                    }}
                    onClick={() => {
                      logout();
                    }}
                  >
                    Sign Out
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    sx={{
                      bgcolor: "#ff1744",
                      m: "4px",
                      textTransform: "none",
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    color="inherit"
                    sx={{
                      bgcolor: "#ff1744",
                      m: "4px",
                      textTransform: "none",
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
