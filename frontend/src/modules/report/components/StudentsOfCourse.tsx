import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { COMPONENT_STAGES, useAppDispatch, useAppSelector } from "../../base";
import { getStudentsByCourse } from "../redux/actions";
import StudentCountBarChart from "./StudentCountBarChart";

const StudentsOfCourse = () => {
  const dispatch = useAppDispatch();

  const { courses, studentsByCourse } = useAppSelector((state) => state.report);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCourse, setSelectedCourse] = useState("");
  const years = Array.from({ length: 5 }, (_, i) => selectedYear - i);

  useEffect(() => {
    if (courses.data.length > 0) {
      setSelectedCourse(courses.data[0].id);
    }
  }, [courses]);

  useEffect(() => {
    if (selectedCourse) {
      handleGetStudentsByCourse(selectedYear, selectedCourse);
    }
  }, [selectedYear, selectedCourse]);

  const handleGetStudentsByCourse = (year: number, courseId: string) => {
    dispatch(
      getStudentsByCourse({
        courseId,
        year,
      })
    );
  };

  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCourse(event.target.value as string);
  };

  return (
    <>
      {studentsByCourse.state === COMPONENT_STAGES.SUCCESS ? (
        <Grid item xs={12} md={12} pl={0}>
          <Paper elevation={3}>
            <Box p={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Students of Course
                </Typography>
                <Box display="flex" gap={2}>
                  <FormControl variant="outlined" style={{ minWidth: 120 }}>
                    <InputLabel id="course-select-label">Course</InputLabel>
                    <Select
                      labelId="course-select-label"
                      id="course-select"
                      value={selectedCourse}
                      // @ts-ignore
                      onChange={handleCourseChange}
                      label="Course"
                    >
                      {courses.data.map((courseItem) => (
                        <MenuItem key={courseItem.id} value={courseItem.id}>
                          {courseItem.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" style={{ minWidth: 120 }}>
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                      labelId="year-select-label"
                      id="year-select"
                      value={selectedYear}
                      // @ts-ignore
                      onChange={handleYearChange}
                      label="Year"
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <StudentCountBarChart data={studentsByCourse.data} />
            </Box>
          </Paper>
        </Grid>
      ) : (
        <Grid item xs={12} md={12}>
          <Paper elevation={3}>
            <Box
              p={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={300}
            >
              <CircularProgress />
            </Box>
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default StudentsOfCourse;
