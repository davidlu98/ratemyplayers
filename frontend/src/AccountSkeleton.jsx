import React from "react";

import { Card, Box, Typography } from "@mui/material";
import PlayerInformationSkeleton from "./PlayerInformationSkeleton";

export default function AccountSkeleton({ user }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: { xs: "100%", sm: "964px" },
        }}
      >
        {" "}
        <Typography sx={{ color: "white", opacity: 0.8, mt: "10px" }}>
          You are logged in as {user.username}
        </Typography>
        <Typography sx={{ color: "white" }}>My Reviews</Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: { xs: "100%", sm: "990px" },
            maxWidth: { xs: "375px", sm: "990px" },
          }}
        >
          <Card
            variant="outlined"
            sx={{
              bgcolor: "#222222",
              margin: "2px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <PlayerInformationSkeleton />
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
