import React from "react";
import { Typography } from "@mui/material";

export default function BannedPage() {
  return (
    <Typography sx={{ color: "red", textAlign: "center", mt: "10px" }}>
      Your account has been banned.
    </Typography>
  );
}
