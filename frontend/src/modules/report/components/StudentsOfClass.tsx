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
import StudentCountBarChart from "../components/StudentCountBarChart";
import { getStudentsByClass } from "../redux/actions";

const StudentsOfClass = () => {
  const dispatch = useAppDispatch();

  const { classes, studentsByClass } = useAppSelector((state) => state.report);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedClass, setSelectedClass] = useState(classes?.data?.[0]?.id);

  const years = Array.from({ length: 5 }, (_, i) => selectedYear - i);

  useEffect(() => {
    if (classes.data.length > 0) {
      setSelectedClass(classes.data[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedClass) {
      handleGetStudentsByClass(selectedYear, selectedClass);
    }
  }, [selectedYear, selectedClass]);

  const handleGetStudentsByClass = (year: number, classId: string) => {
    dispatch(
      getStudentsByClass({
        classId,
        year,
      })
    );
  };

  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as string);
  };

  return (
    <>
      {studentsByClass.state === COMPONENT_STAGES.SUCCESS ? (
        <Grid item xs={12} md={12}>
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
                  Students of Class
                </Typography>
                <Box display="flex" gap={2}>
                  <FormControl variant="outlined" style={{ minWidth: 120 }}>
                    <InputLabel id="class-select-label">Class</InputLabel>
                    <Select
                      labelId="class-select-label"
                      id="class-select"
                      value={selectedClass}
                      // @ts-ignore
                      onChange={handleClassChange}
                      label="Class"
                    >
                      {classes.data.map((classItem) => (
                        <MenuItem key={classItem.id} value={classItem.id}>
                          {classItem.className}
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
              <StudentCountBarChart data={studentsByClass.data} />
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

export default StudentsOfClass;
