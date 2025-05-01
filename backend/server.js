require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://maplereviews.onrender.com", // Deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

const players = require("./players");
const reviews = require("./reviews");
const register = require("./register");
const login = require("./login");
const account = require("./account");
const vote = require("./vote");
const reports = require("./reports");
const feedback = require("./feedback");

app.use("/players", players);
app.use("/reviews", reviews);
app.use("/register", register);
app.use("/login", login);
app.use("/account", account);
app.use("/vote", vote);
app.use("/reports", reports);
app.use("/feedback", feedback);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
