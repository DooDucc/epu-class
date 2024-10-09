import { Box, Container, Grid } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../../base";
import {
  PointOfClass,
  PointOfCourse,
  StudentsOfClass,
  StudentsOfCourse,
} from "../components";
import { getClasses, getCourses } from "../redux/actions";

const ReportPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getClasses());
    dispatch(getCourses());
  }, []);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
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
