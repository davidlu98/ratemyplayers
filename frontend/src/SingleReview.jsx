import { Box, Card, CardContent, Typography } from "@mui/material";

export default function SingleReview({ review }) {
  const filledStar = "/filled-star2.png";

  // Format the created_at field
  const formattedDate = new Date(review.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Card
      sx={{
        bgcolor: "#222222",
        color: "white",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
        width: { xs: "100%", sm: "680px" },
        maxWidth: { xs: "390px", sm: "680px" },
      }}
    >
      <CardContent>
        {/* Star Rating & Date */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Star Rating */}
            <Box display="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={filledStar}
                  alt="star"
                  style={{
                    width: "24px",
                    height: "24px",
                    filter: i < review.rating ? "none" : "grayscale(100%)",
                    opacity: i < review.rating ? 1 : 0.4, // Dim the stars not part of the rating
                    pointerEvents: "none",
                  }}
                />
              ))}
            </Box>

            {/* Date */}
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {formattedDate}
            </Typography>
          </Box>
          {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}> */}
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            by {review.user.username}
          </Typography>
        </Box>

        {/* Review Comment */}
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            marginTop: "6px",
            fontSize: "0.95rem",
          }}
        >
          {review.comment}
        </Typography>
      </CardContent>
    </Card>
  );
}
