import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ flex: 1 }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
