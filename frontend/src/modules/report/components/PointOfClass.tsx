import { Box, Grid, Typography, Autocomplete, TextField } from "@mui/material";
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
import { getClassExerciseStats } from "../redux/actions";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PointOfClass = () => {
  const dispatch = useAppDispatch();

  const { classExerciseStats, classes } = useAppSelector(
    (state) => state.report
  );
  const [selectedClass, setSelectedClass] = useState("");

  const data = [
    { name: "0-4", value: classExerciseStats.data.percentages.lowRange },
    { name: "5-7", value: classExerciseStats.data.percentages.midRange },
    {
      name: "8-10",
      value: classExerciseStats.data.percentages.highRange,
    },
  ];

  useEffect(() => {
    if (classes.data.length > 0) {
      setSelectedClass(classes.data[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedClass) {
      handleGetClassExerciseStats(selectedClass);
    }
  }, [selectedClass]);

  const handleGetClassExerciseStats = (classId: string) => {
    dispatch(
      getClassExerciseStats({
        classId,
      })
    );
  };

  return (
    <Grid item xs={12} md={6}>
      <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", p: 1 }}>
        <Box sx={{ width: "100%", height: 250, pb: 1, mb: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Point percentage of class
            </Typography>
            <Autocomplete
              disablePortal
              disableClearable
              id="class-select"
              options={classes.data}
              getOptionLabel={(option) => option.className}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="Search Class" />
              )}
              ListboxProps={{
                style: {
                  maxHeight: 200,
                },
              }}
              value={
                classes.data.find((c) => c.id === selectedClass) || undefined
              }
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedClass(newValue.id);
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
          Total Submissions: {classExerciseStats.data.totalSubmissions}
        </Typography>
      </Box>
    </Grid>
  );
};

export default PointOfClass;
