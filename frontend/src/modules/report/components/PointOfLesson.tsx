import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
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
import { getLessonExerciseStats } from "../redux/actions";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PointOfLesson = () => {
  const dispatch = useAppDispatch();

  const { lessonExerciseStats, lessons } = useAppSelector(
    (state) => state.report
  );
  const [selectedLesson, setSelectedLesson] = useState("");

  const data = [
    { name: "0-4", value: lessonExerciseStats.data.percentages.lowRange },
    { name: "5-7", value: lessonExerciseStats.data.percentages.midRange },
    {
      name: "8-10",
      value: lessonExerciseStats.data.percentages.highRange,
    },
  ];

  useEffect(() => {
    if (lessons.data.length > 0) {
      setSelectedLesson(lessons.data[0].id);
    }
  }, [lessons]);

  useEffect(() => {
    if (selectedLesson) {
      handleGetLessonExerciseStats(selectedLesson);
    }
  }, [selectedLesson]);

  const handleGetLessonExerciseStats = (lessonId: string) => {
    dispatch(
      getLessonExerciseStats({
        lessonId,
      })
    );
  };

  return (
    <Grid item xs={12} md={6}>
      <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", p: 1 }}>
        <Box sx={{ width: "100%", height: 250, pb: 1, mb: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Point percentage of lesson
            </Typography>
            <Autocomplete
              disablePortal
              disableClearable
              id="class-select"
              options={lessons.data}
              getOptionLabel={(option) => option.title}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="Search Lesson" />
              )}
              ListboxProps={{
                style: {
                  maxHeight: 200,
                },
              }}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedLesson(newValue.id);
                }
              }}
            />
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
                {data.map((_, index) => (
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
          Total Submissions: {lessonExerciseStats.data.totalSubmissions}
        </Typography>
      </Box>
    </Grid>
  );
};

export default PointOfLesson;
