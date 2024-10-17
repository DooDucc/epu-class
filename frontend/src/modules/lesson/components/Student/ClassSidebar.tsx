import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../base";
import {
  Box,
  List,
  ListItemText,
  ListItemButton,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "react-router-dom";
import { StudentLesson, StudentLessonType } from "../../types";

interface ClassSidebarProps {
  handleSelectedStudentLessons: (
    lesson: StudentLessonType[],
    classId: string
  ) => void;
}

const ClassSidebar = ({ handleSelectedStudentLessons }: ClassSidebarProps) => {
  const { classId } = useParams();

  const {
    studentLesson: { data: studentLessons },
  } = useAppSelector((state) => state.lesson);

  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({});
  const [searchClasses, setSearchClasses] = useState<string>("");
  const [filteredData, setFilteredData] = useState<StudentLesson[]>([]);

  useEffect(() => {
    if (searchClasses) {
      const filteredData = studentLessons.filter((studentLesson) =>
        studentLesson.className
          .toLowerCase()
          .includes(searchClasses.toLowerCase())
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(studentLessons);
    }
  }, [searchClasses, studentLessons]);

  useEffect(() => {
    setFilteredData(studentLessons);
  }, [studentLessons]);

  const handleToggle = (
    id: string,
    _: Record<string, boolean>,
    setOpenState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    setOpenState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (classId) {
      studentLessons.forEach((studentLesson) => {
        if (studentLesson.id === classId) {
          setOpenClasses((prev) => ({ ...prev, [studentLesson.id]: true }));
          handleSelectedStudentLessons(studentLesson.lessons, studentLesson.id);
        }
      });
    }
  }, [classId, studentLessons]);

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: 300,
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 1, pb: 0 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search classes..."
            value={searchClasses}
            onChange={(e) => setSearchClasses(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            flex: 1,
            overflow: "auto",
          }}
        >
          {filteredData.map((studentLesson) => (
            <Box
              key={studentLesson.id}
              sx={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <ListItemButton
                onClick={() => {
                  handleToggle(studentLesson.id, openClasses, setOpenClasses);
                  handleSelectedStudentLessons(
                    studentLesson.lessons,
                    studentLesson.id
                  );
                }}
                selected={studentLesson.id === classId}
              >
                <ListItemText primary={studentLesson.className} />
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ClassSidebar;
