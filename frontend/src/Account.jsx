import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Box, Button, Typography, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SingleReview from "./SingleReview";
import PlayerInformation from "./PlayerInformation";

export default function Account({ user }) {
  const [reviews, setReviews] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // console.log(selectedPlayer);

  if (!user) {
    return <h1>You are not logged in</h1>;
  }

  const getReviews = async () => {
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        const { data } = await axios.get(
          "https://ywratemyplayersbackend2025.onrender.com/account/reviews",
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
        await axios.delete(
          `https://ywratemyplayersbackend2025.onrender.com/reviews/${id}`,
          {
            headers: { authorization: token },
          }
        );
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
      <Typography variant="h6" sx={{ color: "white" }}>
        You are logged in as {user.username}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            marginTop: "16px",
            marginBottom: "10px",
            bgcolor: "#1a1a1a",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
            padding: "10px",
            maxWidth: "865px",
            width: "100%",
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", color: "white" }}>
            My Reviews
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: "890px",
          }}
        >
          {Object.entries(reviews).map(
            ([playerName, { playerInfo, reviews }]) => {
              return (
                <Card
                  variant="outlined"
                  key={playerName}
                  onClick={() => setSelectedPlayer({ playerInfo, reviews })}
                  sx={{ margin: "2px" }}
                >
                  <PlayerInformation playerData={playerInfo} />
                </Card>
              );
            }
          )}

          <Modal
            open={!!selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(1px)",
            }}
          >
            <Box
              sx={{
                marginTop: "16px",
                backgroundColor: "#1e1e1e",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
                padding: "10px",
                maxWidth: "750px",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              {selectedPlayer && (
                <>
                  <Box
                    sx={{
                      margin: "10px",
                      boxShadow: "0px 4x 10px rgba(0,0,0,0.5)",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Reviews for {selectedPlayer.playerInfo.current_name}
                    </Typography>
                  </Box>
                  {selectedPlayer.reviews.map((review, index) => {
                    return (
                      <Card
                        key={index}
                        style={{
                          backgroundColor: "#1a1a1a", // Dark background for contrast
                          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
                          marginTop: "10px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <SingleReview review={review} />
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#ff1744" }}
                          onClick={() => {
                            deleteReview(review.id);
                            setSelectedPlayer(null);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Card>
                    );
                  })}
                </>
              )}
            </Box>
          </Modal>
        </Box>
        ;
      </Box>
    </>
  );
}
