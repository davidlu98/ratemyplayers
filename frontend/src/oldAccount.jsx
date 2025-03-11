import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Box, Button, Typography } from "@mui/material";
import SingleReview from "./SingleReview";

export default function Account({ user }) {
  const [reviews, setReviews] = useState([]);

  if (!user) {
    return <h1>You are not logged in</h1>;
  }

  const getReviews = async () => {
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/account/reviews",
          {
            headers: { authorization: token },
          }
        );
        // console.log(data);

        // Group reviews by player.current_name
        const groupedReviews = data.reduce((acc, review) => {
          const { current_name, avatar, region, server, level, job } =
            review.player;

          if (!acc[current_name]) {
            acc[current_name] = {
              playerInfo: { current_name, avatar, region, server, level, job },
              reviews: [],
            };
          }

          acc[current_name].reviews.push(review);
          return acc;
        }, {});

        // console.log(groupedReviews);

        setReviews(groupedReviews);
      } catch (error) {
        console.log("Error when obtaining review");
      }
    }
  };

  const deleteReview = async (id) => {
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        await axios.delete(`http://localhost:3000/reviews/${id}`, {
          headers: { authorization: token },
        });
        getReviews();
      } catch (error) {
        console.log("Error when deleting review");
      }
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <>
      <Typography variant="h6">You are logged in as {user.username}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "red",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            marginTop: "16px",
            bgcolor: "#1a1a1a",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
            padding: "10px",
            maxWidth: "650px",
            width: "650px",
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", color: "white" }}>
            My Reviews
          </Typography>
        </Box>
        {reviews.map((review, index) => {
          return (
            <Card
              key={index}
              variant="outlined"
              style={{ marginTop: "20px", padding: "10px" }}
            >
              <SingleReview review={review} />
              <Button
                variant="contained"
                color="inherit"
                onClick={() => {
                  deleteReview(review.id);
                }}
              >
                Delete
              </Button>
            </Card>
          );
        })}
      </Box>
    </>
  );
}
