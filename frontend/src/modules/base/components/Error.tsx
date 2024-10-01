import { Box, Typography } from "@mui/material";

const Error = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ flex: 1 }}
    >
      <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
        Something went wrong
      </Typography>
    </Box>
  );
};

export default Error;
