import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";

interface ClassHeaderProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h3" color="primary">
        Classes
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search classes"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            style: {
              width: 300,
              height: 54,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ClassHeader;
