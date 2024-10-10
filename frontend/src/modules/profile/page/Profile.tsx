import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../base/redux/store";
import { Box, Typography, Avatar, Paper, Grid, Container } from "@mui/material";

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Typography>No user information available.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Avatar
              src={user.avatar}
              alt={user.fullName}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {user.fullName}
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              {user.email && (
                <Typography variant="subtitle1" color="text.secondary">
                  Email: {user.email}
                </Typography>
              )}
              {user.studentCode && (
                <Typography variant="subtitle1" color="text.secondary">
                  Student Code: {user.studentCode}
                </Typography>
              )}
              {user.class && (
                <Typography variant="subtitle1" color="text.secondary">
                  Class: {user.class}
                </Typography>
              )}
              <Typography variant="subtitle1" color="text.secondary">
                Phone: {user.phone}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
