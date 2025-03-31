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
import ReviewVote from "./ReviewVote";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Account({ user }) {
  const [reviews, setReviews] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!user) {
    return (
      <Typography sx={{ color: "red", textAlign: "center", mt: "10px" }}>
        Must be logged in to view Account.
      </Typography>
    );
  }

  const getReviews = async () => {
    setLoading(true);
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        const { data } = await axios.get(`${API_URL}/account/reviews`, {
          headers: { authorization: token },
        });

        setReviews(data);
      } catch (error) {
        if (error.response) {
          setErrorMessage(error.response.data); // Display server error
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
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
        if (error.response) {
          setErrorMessage(error.response.data); // Display server error
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      }
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <>
      {loading ? (
        <Typography sx={{ color: "white", textAlign: "center", mt: "10px" }}>
          Loading...
        </Typography>
      ) : (
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
            <Typography sx={{ color: "red", mt: "10px" }}>
              {errorMessage}
            </Typography>
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
                maxWidth: { xs: "375px", sm: "990px" },
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
                    mt: "16px",
                    bgcolor: "#0a0a0a",
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
                      <Box>
                        {selectedPlayer.reviews.map((review, index) => {
                          return (
                            <Card
                              key={index}
                              sx={{
                                bgcolor: "#1f1f1f",
                                mt: "10px",
                                padding: "2px",
                                borderColor: "gray.500",
                                width: isMobile ? "360px" : "auto",
                                border: "1px solid #a0aec0",
                              }}
                            >
                              <SingleReview review={review} />
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <ReviewVote reviewId={review.id} />
                                <Button
                                  sx={{
                                    color: "#ff1744",
                                    margin: "4px",
                                    textTransform: "none",
                                  }}
                                  onClick={() => {
                                    setConfirmDeleteModal(review.id);
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Box>
                            </Card>
                          );
                        })}
                      </Box>
                    </>
                  )}
                </Box>
              </Modal>
            </Box>

            <Modal
              open={!!confirmDeleteModal}
              onClose={() => setConfirmDeleteModal(null)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(1px)",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#0a0a0a",
                  padding: "15px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
                }}
              >
                <Typography sx={{ color: "white", marginBottom: "10px" }}>
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      deleteReview(confirmDeleteModal);
                      setConfirmDeleteModal(null);
                      setSelectedPlayer(null);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      textTransform: "none",
                    }}
                    onClick={() => setConfirmDeleteModal(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        </Box>
      )}
    </>
  );
}
