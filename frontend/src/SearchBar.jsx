import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  const [playerName, setPlayerName] = useState("");
  const [region, setRegion] = useState("NA");
  const navigate = useNavigate();

  const searchPlayer = (event) => {
    event.preventDefault();

    if (playerName.trim() !== "") {
      navigate(`/players/${region}/${playerName}`);
      setPlayerName("");
    }
  };

  return (
    <Box sx={{ minWidth: 120, my: 2 }}>
      <form onSubmit={searchPlayer}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "center",
          }}
        >
          <FormControl>
            <InputLabel id="region-label" sx={{ color: "#ff1744" }}>
              Region
            </InputLabel>
            <Select
              labelId="region-label"
              id="region-select"
              value={region}
              label="Region"
              onChange={(event) => setRegion(event.target.value)}
              size="small"
              sx={{
                color: "white", // Selected text color
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ff1744",
                }, // Default border
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ff8a80",
                }, // Hover border
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ff1744",
                }, // Focus border
                "& .MuiSvgIcon-root": { color: "#ff1744" }, // Arrow icon color
              }}
            >
              <MenuItem value={"NA"}>NA</MenuItem>
              <MenuItem value={"EU"}>EU</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Character Name"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            variant="outlined"
            size="small"
            sx={{
              width: 200,
              "& .MuiInputLabel-root": { color: "#ff1744" }, // Label color
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff1744" }, // Default border color
                "&:hover fieldset": { borderColor: "#ff8a80" }, // Hover border color
                "&.Mui-focused fieldset": { borderColor: "#ff1744" }, // Focused border color
              },
              "& input": { color: "white" }, // Text color
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#ff1744", // Change button background color
              color: "white", // Change text color
              "&:hover": { backgroundColor: "#e64a19" }, // Change hover color
            }}
          >
            <SearchIcon />
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SearchBar;
