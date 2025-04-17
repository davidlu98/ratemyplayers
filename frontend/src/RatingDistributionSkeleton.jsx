import React from "react";

import { Box, Skeleton } from "@mui/material";

export default function RatingDistributionSkeleton() {
  return (
    <Box
      sx={{
        bgcolor: "#222222",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        padding: { xs: "8px", sm: "16px" },
        width: { xs: "100%", sm: "325px" },
        maxWidth: { xs: "355px" },
      }}
    >
      {" "}
      <Skeleton
        sx={{ height: 230, bgcolor: "#222222" }}
        variant="rectangular"
        animation="wave"
      />
    </Box>
  );
}
