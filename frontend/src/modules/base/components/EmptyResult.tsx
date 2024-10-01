import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

interface EmptyResultProps {
  message?: string;
  height?: number;
}

const EmptyResult: React.FC<EmptyResultProps> = ({
  message = "No results found",
  height = 200,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={height}
      padding={4}
    >
      <SentimentDissatisfiedIcon
        sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
      />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyResult;
