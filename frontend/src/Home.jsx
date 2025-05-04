import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Pagination,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import HotPlayers from "./HotPlayers";
import RangeMenu from "./RangeMenu";

import HomeSkeleton from "./HomeSkeleton";

import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [hotPlayers, setHotPlayers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [page, setPage] = useState(1);
  const [range, setRange] = useState("1h");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    setPage(1); // Reset page
  };

  const fetchPlayerData = async () => {
    const token = window.localStorage.getItem("token");

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/players/hot?range=${range}&page=${page}`,
        {
          params: { range, page },
          headers: { authorization: token },
        }
      );

      setHotPlayers(data.leaderboard);
      setTotalPages(data.totalPages);
      setTotalPlayers(data.totalPlayers);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data); // Display server error
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, [range, page]);

  return (
    <>
      {loading ? (
        <HomeSkeleton />
      ) : errorMessage ? (
        <Box sx={{ mt: "10px", textAlign: "center" }}>
          <Typography sx={{ color: "red" }}>
            UPDATE: Website occasionally goes down for updates, or other
            reasons.
          </Typography>
          <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Typography sx={{ color: "red" }}>
              UPDATE: Website will be down for a few hours after 3PM EST.
            </Typography> */}
            <HotPlayers hotPlayers={hotPlayers} />
            <RangeMenu range={range} onRangeChange={handleRangeChange} />
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
                mb: 2,
              }}
            />
          </Box>
          {!isMobile && (
            <Box>
              <Button
                component={Link}
                to="/feedback"
                sx={{
                  color: "white",
                  bgcolor: "#ff1744",
                  mt: "10px",
                  mb: "14px",
                  textTransform: "none",
                }}
              >
                Feedback
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
