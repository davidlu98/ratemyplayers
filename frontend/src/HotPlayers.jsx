import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";

export default function HotPlayers({ hotPlayers }) {
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
        Hot Players
      </Typography>
      <Box
        sx={{
          width: { xs: "100%", sm: "600px" },
          textAlign: { xs: "center", sm: "start" },
        }}
      >
        {hotPlayers.map((player, index) => {
          return (
            <Card
              variant="outlined"
              key={index}
              sx={{ margin: "1px", bgcolor: "#222222" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link
                  to={`/players/${player.region}/${player.current_name}`}
                  style={{ color: "white", textDecoration: "none", flex: 1 }}
                >
                  <Typography variant="body1">
                    {player.current_name} - {player.job} - {player.level} -{" "}
                    {player.server} -{" "}
                    <span style={{ opacity: "0.8" }}>({player.region})</span>
                  </Typography>
                </Link>

                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    opacity: "0.6",
                    ml: 2,
                  }}
                >
                  {player.review_count} review{player.review_count !== 1 && "s"}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
