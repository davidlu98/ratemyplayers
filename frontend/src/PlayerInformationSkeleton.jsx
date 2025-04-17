import React from "react";

import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";

export default function PlayerInformationSkeleton() {
  return (
    <Box
      sx={{
        bgcolor: "#222222",
        color: "white",
        textAlign: "center",
        padding: { xs: "8px", sm: "20px" },
        width: { xs: "100%", sm: "283px" },
        maxWidth: { xs: "355px", sm: "283px" },
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
      }}
    >
      <Skeleton
        sx={{ height: 230, bgcolor: "#222222" }}
        variant="rectangular"
        animation="wave"
      />
    </Box>
  );
}
