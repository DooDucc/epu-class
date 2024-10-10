import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../../base";
import {
  PointOfClass,
  PointOfCourse,
  StudentsOfClass,
  StudentsOfCourse,
  TotalInfo,
} from "../components";
import { getClasses, getCourses, getTotalInfo } from "../redux/actions";

const ReportPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTotalInfo());
    dispatch(getClasses());
    dispatch(getCourses());
  }, []);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" mb={4} textAlign="center">
          Teacher Dashboard
        </Typography>
        <TotalInfo />
        <Grid container spacing={3}>
          <PointOfClass />
          <PointOfCourse />
          <StudentsOfClass />
          <StudentsOfCourse />
        </Grid>
      </Box>
    </Container>
  );
};

export default ReportPage;
