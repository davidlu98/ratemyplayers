import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Box,
  Button,
  Typography,
  Modal,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SingleReview from "./SingleReview";
import PlayerInformation from "./PlayerInformation";

export default function Account({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reviews, setReviews] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "10px" }}>
        <Typography sx={{ color: "red" }}>
          Must be logged in to view Account.
        </Typography>
      </Box>
    );
  }

  const getReviews = async () => {
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        const { data } = await axios.get(`${API_URL}/account/reviews`, {
          headers: { authorization: token },
        });

        setReviews(data);
      } catch (error) {
        console.log("Error when obtaining all review");
      }
    }
  };

  const deleteReview = async (id) => {
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        await axios.delete(`${API_URL}/reviews/${id}`, {
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
        <Typography sx={{ color: "white", opacity: 0.8 }}>
          You are logged in as {user.username}
        </Typography>
        <Typography sx={{ color: "white" }}>My Reviews</Typography>
        {/* Player container */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: { xs: "100%", sm: "990px" },
            maxWidth: { xs: "390px", sm: "990px" },
          }}
        >
          {Object.entries(reviews).map(
            ([playerName, { playerInfo, reviews }]) => {
              return (
                <Card
                  variant="outlined"
                  key={playerName}
                  onClick={() => setSelectedPlayer({ playerInfo, reviews })}
                  sx={{
                    margin: "2px",
                    width: { xs: "100%", sm: "auto" },
                  }}
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
                  <Box>
                    <Typography
                      sx={{
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
                          marginTop: "8px",
                          width: isMobile ? "360px" : "auto",
                        }}
                      >
                        <SingleReview review={review} />
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#ff1744",
                            margin: "4px",
                            textTransform: "none",
                          }}
                          onClick={() => {
                            deleteReview(review.id);
                            setSelectedPlayer(null);
                          }}
                        >
                          Delete
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
    </Box>
  );
}
