import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function RecentReviews({ recentPlayers }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#1a1a1a",
        mb: 2,
        border: "1px solid #a0aec0",
      }}
    >
      <Typography sx={{ color: "white", margin: "10px" }}>
        Recent reviews of the day
      </Typography>
      <Box
        sx={{
          width: { xs: "100%", sm: "600px" },
          textAlign: { xs: "center", sm: "start" },
        }}
      >
        {recentPlayers.map((player, index) => {
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
