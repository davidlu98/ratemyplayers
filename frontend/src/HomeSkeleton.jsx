import React from "react";
import {
  Button,
  Box,
  Typography,
  Skeleton,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function HomeSkeleton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
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
              width: { xs: "345px", sm: "600px" },
              textAlign: { xs: "center", sm: "start" },
            }}
          >
            <Card variant="outlined" sx={{ margin: "1px", bgcolor: "#222222" }}>
              <Skeleton
                sx={{ height: 665, bgcolor: "#222222" }}
                animation="wave"
                variant="rectangular"
              />
            </Card>
          </Box>
        </Box>
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
            Most reviewed players
          </Typography>
          <Box
            sx={{
              width: { xs: "100%", sm: "600px" },
              textAlign: { xs: "center", sm: "start" },
            }}
          >
            <Card variant="outlined" sx={{ margin: "1px", bgcolor: "#222222" }}>
              <Skeleton
                sx={{ height: 665, bgcolor: "#222222" }}
                animation="wave"
                variant="rectangular"
              />
            </Card>
          </Box>
        </Box>
      </Box>
      {!isMobile && (
        <Box>
          <Button
            component={Link}
            to="/feedback"
            sx={{
              color: "white",
              bgcolor: "#ff1744",
              mb: "14px",
              textTransform: "none",
            }}
          >
            Feedback
          </Button>
        </Box>
      )}
    </Box>
  );
}
