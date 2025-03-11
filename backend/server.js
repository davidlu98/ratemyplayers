const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

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

app.listen(3000);
