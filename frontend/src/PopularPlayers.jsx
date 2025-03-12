import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function PopularPlayers({ popularPlayers }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#1F1F1F",
        margin: "px",
      }}
    >
      <Typography sx={{ color: "white", margin: "10px" }}>
        Popular players of the day
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          width: "600px",
        }}
      >
        {popularPlayers.map((player, index) => {
          return (
            <Card
              variant="outlined"
              key={index}
              sx={{ margin: "1px", bgcolor: "#222222" }}
            >
              <CardContent>
                <Link
                  to={`/players/${player.region}/${player.current_name}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <Typography variant="body1">
                    {player.current_name} - {player.job} - {player.level} -{" "}
                    {player.server} -{" "}
                    <span style={{ opacity: "0.8" }}>({player.region})</span>
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
