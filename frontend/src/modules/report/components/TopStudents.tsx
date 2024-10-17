import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../base";
import { getTopStudentsByClass } from "../redux/actions";
import { TopStudent, Class } from "../types/sliceTypes";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  Avatar,
  Grid,
} from "@mui/material";

const TopStudents: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    classes,
    topStudentsByClass: { data: topStudents },
  } = useAppSelector((state) => state.report);

  const [selectedClass, setSelectedClass] = useState<string>("");

  useEffect(() => {
    if (classes.data.length > 0) {
      setSelectedClass(classes.data[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedClass) {
      dispatch(getTopStudentsByClass({ classId: selectedClass }));
    }
  }, [selectedClass, dispatch]);

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as string);
  };

  return (
    <Grid item xs={12} md={6}>
      <Box sx={{ p: 2, width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Top Students
        </Typography>
        <FormControl sx={{ mb: 2, width: 200 }}>
          <InputLabel id="class-select-label">Select Class</InputLabel>
          <Select
            labelId="class-select-label"
            value={selectedClass}
            label="Select Class"
            // @ts-ignore
            onChange={handleClassChange}
          >
            {classes.data.map((classItem: Class) => (
              <MenuItem key={classItem.id} value={classItem.id}>
                {classItem.className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {topStudents && topStudents.length > 0 ? (
          <List>
            {topStudents.map((student: TopStudent) => (
              <Box
                key={student.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pb: 1,
                  mb: 1,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={student.avatar} alt={student.fullName} />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body1">{student.fullName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Student Code: {student.studentCode}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Submitted Exercises: {student.count}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary">
                  {student.percentage}
                </Typography>
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body1">
            No top students data available for this class.
          </Typography>
        )}
      </Box>
    </Grid>
  );
};

export default TopStudents;
