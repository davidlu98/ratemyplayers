import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";

export default function MostReviewedPlayers({ mostReviewedPlayers }) {
  // console.log("in mrp", mostReviewedPlayers);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#1F1F1F",
      }}
    >
      <Typography sx={{ color: "white", margin: "10px" }}>
        Most reviewed players
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          width: "600px",
        }}
      >
        {Object.entries(mostReviewedPlayers).map(
          ([playerName, { playerInfo, _ }]) => {
            return (
              <Card
                variant="outlined"
                key={playerName}
                sx={{ margin: "1px", bgcolor: "#222222" }}
              >
                <CardContent>
                  <Link
                    to={`/players/${playerInfo.region}/${playerInfo.current_name}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <Typography variant="body1">
                      {playerInfo.current_name} - {playerInfo.job} -{" "}
                      {playerInfo.level} - {playerInfo.server} -{" "}
                      <span style={{ opacity: "0.8" }}>
                        ({playerInfo.region})
                      </span>
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
            );
          }
        )}
      </Box>
    </Box>
  );
}
