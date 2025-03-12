import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const filledStar = "/filled-star2.png";

export default function ButtonAppBar({ user, logout }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
            <Typography variant="h6" component="div">
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
          <SearchBar />
          <Box>
            {user ? (
              <>
                <Button
                  color="inherit"
                  style={{ backgroundColor: "#ff1744", margin: "4px" }}
                  onClick={() => navigate("/account")}
                >
                  Account
                </Button>
                <Button
                  color="inherit"
                  style={{ backgroundColor: "#ff1744", margin: "4px" }}
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  style={{ backgroundColor: "#ff1744", margin: "4px" }}
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>
                <Button
                  color="inherit"
                  style={{ backgroundColor: "#ff1744", margin: "4px" }}
                  onClick={() => navigate("/register")}
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
