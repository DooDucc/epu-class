import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useAppSelector } from "../../../base";

interface ClassHeaderProps {
  selectedMajor: string | null;
  searchTerm: string;
  setSelectedMajor: (majorId: string | null) => void;
  setSearchTerm: (searchTerm: string) => void;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({
  selectedMajor,
  searchTerm,
  setSelectedMajor,
  setSearchTerm,
}) => {
  const {
    createClass: { majors },
  } = useAppSelector((state) => state.class);

  const handleMajorClick = (majorId: string) => {
    setSelectedMajor(majorId === selectedMajor ? null : majorId);
  };

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" color="primary">
          Filter by major
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {majors?.map((major) => (
            <Chip
              key={major.id}
              label={major.name}
              onClick={() => handleMajorClick(major.id)}
              color={selectedMajor === major.id ? "primary" : "default"}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" color="primary">
          Search by class name
        </Typography>
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
          }}
        />
      </Box>
    </Box>
  );
};

export default ClassHeader;
