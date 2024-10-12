import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
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

  const handleMajorChange = (event: SelectChangeEvent<string>) => {
    setSelectedMajor(event.target.value as string);
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
      <Typography variant="h3" color="primary">
        Classes
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="major-select-label">Major</InputLabel>
          <Select
            labelId="major-select-label"
            id="major-select"
            value={selectedMajor || ""}
            label="Major"
            onChange={handleMajorChange}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {majors?.map((major) => (
              <MenuItem key={major.id} value={major.id}>
                {major.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
