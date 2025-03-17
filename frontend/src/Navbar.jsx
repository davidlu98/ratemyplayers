import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const filledStar = "/filled-star2.png";

export default function ButtonAppBar({ user, logout }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Section: Logo & Home */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
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
                  RateMyPlayers
                </Link>
              </Typography>
            </Box>
            <Typography variant="h6">
              <Link
                to="/"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Home
              </Link>
            </Typography>
          </Box>

          {/* Center Section: SearchBar */}
          <SearchBar />

          {/* Right Section: Login / Signup */}
          <Box>
            {user ? (
              <>
                <Button
                  component={Link}
                  to="/account"
                  color="inherit"
                  style={{
                    backgroundColor: "#ff1744",
                    margin: "4px",
                    textTransform: "none",
                  }}
                >
                  Account
                </Button>
                <Button
                  color="inherit"
                  style={{
                    backgroundColor: "#ff1744",
                    margin: "4px",
                    textTransform: "none",
                  }}
                  onClick={() => {
                    logout();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  style={{
                    backgroundColor: "#ff1744",
                    margin: "4px",
                    textTransform: "none",
                  }}
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  color="inherit"
                  style={{
                    backgroundColor: "#ff1744",
                    margin: "4px",
                    textTransform: "none",
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
