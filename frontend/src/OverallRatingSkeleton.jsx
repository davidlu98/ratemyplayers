import React from "react";

import { Box, Skeleton } from "@mui/material";

export default function OverallRatingSkeleton() {
  return (
    <Box
      sx={{
        textAlign: "center",
        bgcolor: "#222222",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        padding: { xs: "8px", sm: "10px" },
        width: { xs: "100%", sm: "660px" },
        maxWidth: { xs: "355px", sm: "660px" },
      }}
    >
      <Skeleton
        sx={{ height: 90, bgcolor: "#222222" }}
        variant="rectangular"
        animation="wave"
      />
    </Box>
  );
}
