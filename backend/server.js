const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "https://ywratemyplayers2025.onrender.com",
  })
);
app.use(express.json());

const players = require("./players");
const reviews = require("./reviews");
const register = require("./register");
const login = require("./login");
const account = require("./account");

app.use("/players", players);
app.use("/reviews", reviews);
app.use("/register", register);
app.use("/login", login);
app.use("/account", account);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
