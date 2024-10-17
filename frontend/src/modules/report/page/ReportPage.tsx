import { Box, Container, Grid } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../../base";
import {
  PointOfClass,
  PointOfLesson,
  StudentsOfClass,
  TopStudents,
  TotalInfo,
} from "../components";
import { getClasses, getLessons, getTotalInfo } from "../redux/actions";

const ReportPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTotalInfo());
    dispatch(getClasses());
    dispatch(getLessons());
  }, []);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <TotalInfo />
        <Grid container spacing={3}>
          <PointOfClass />
          <PointOfLesson />
          <StudentsOfClass />
          <TopStudents />
        </Grid>
      </Box>
    </Container>
  );
};

export default ReportPage;
