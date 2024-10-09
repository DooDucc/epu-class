import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../base";
import { getCourseExerciseStats } from "../redux/actions";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PointOfCourse = () => {
  const dispatch = useAppDispatch();

  const { courseExerciseStats, courses } = useAppSelector(
    (state) => state.report
  );
  const [selectedCourse, setSelectedCourse] = useState("");

  const data = [
    { name: "0-4", value: courseExerciseStats.data.percentages.lowRange },
    { name: "5-7", value: courseExerciseStats.data.percentages.midRange },
    {
      name: "8-10",
      value: courseExerciseStats.data.percentages.highRange,
    },
  ];

  useEffect(() => {
    if (courses.data.length > 0) {
      setSelectedCourse(courses.data[0].id);
    }
  }, [courses]);

  useEffect(() => {
    if (selectedCourse) {
      handleGetCourseExerciseStats(selectedCourse);
    }
  }, [selectedCourse]);

  const handleGetCourseExerciseStats = (courseId: string) => {
    dispatch(
      getCourseExerciseStats({
        courseId,
      })
    );
  };

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCourse(event.target.value as string);
  };

  return (
    <Grid item xs={12} md={6}>
      <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", p: 1 }}>
        <Box sx={{ width: "100%", height: 250, pb: 1, mb: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Point percentage of course
            </Typography>
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
          </Box>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Typography sx={{ textAlign: "center" }}>
          Total Submissions: {courseExerciseStats.data.totalSubmissions}
        </Typography>
      </Box>
    </Grid>
  );
};

export default PointOfCourse;
