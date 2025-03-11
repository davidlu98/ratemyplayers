import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      console.log("data in login:", data);
      window.localStorage.setItem("token", data);

      const response = await axios.get("http://localhost:3000/account", {
        headers: { authorization: data },
      });

      setUser(response.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "200px",
      }}
    >
      <Paper
        sx={{
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          background: "white",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: "16px", fontWeight: "bold" }}
        >
          Sign In
        </Typography>
        <form
          onSubmit={login}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#ff1744" }}
            fullWidth
          >
            Sign In
          </Button>
        </form>
        <Typography variant="body2" style={{ marginTop: "16px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#1976d2" }}>
            Register here!
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
