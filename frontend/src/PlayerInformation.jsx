import React from "react";

import { Typography, Box } from "@mui/material";

export default function PlayerInformation({ playerData }) {
  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        color: "white",
        textAlign: "center",
        padding: "20px",
        width: { xs: "100%", sm: "283px" },
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
      }}
    >
      <Typography variant="h6" fontWeight={"bold"} gutterBottom>
        {playerData.current_name}
      </Typography>
      <img
        src={playerData.avatar}
        alt="player avatar"
        style={{
          width: "125px",
          height: "100px",
          objectFit: "cover",
          marginTop: "10px",
          marginBottom: "15px",
          pointerEvents: "none",
        }}
      />
      <Typography variant="body1" fontWeight={"bold"}>
        Lv. {playerData.level}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {playerData.job} in {playerData.server}
      </Typography>
    </Box>
  );
}
