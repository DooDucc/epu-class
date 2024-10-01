import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../../base";
import {
  Box,
  List,
  ListItemText,
  Collapse,
  ListItemButton,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "react-router-dom";
import { StudentCourseType, StudentLessonType } from "../../types";

interface LessonSidebarProps {
  handleSelectedStudentLessons: (lesson: StudentLessonType[]) => void;
}

const LessonSidebar = ({
  handleSelectedStudentLessons,
}: LessonSidebarProps) => {
  const { lessonId } = useParams();

  const {
    studentLessons: { data: studentLessons },
  } = useAppSelector((state) => state.lesson);

  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({});
  const [searchLessons, setSearchLessons] = useState<string>("");

  const handleToggle = (
    id: string,
    _: Record<string, boolean>,
    setOpenState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    setOpenState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCourses = (courses: StudentCourseType[]) => (
    <List component="div" disablePadding>
      {courses.map((course) => (
        <ListItemButton
          key={course.id}
          sx={{ pl: 6 }}
          onClick={() => handleSelectedStudentLessons(course.lessons)}
          selected={course.id === lessonId}
        >
          <ListItemText primary={course.title} />
        </ListItemButton>
      ))}
    </List>
  );

  //   useEffect(() => {
  //     if (lessonId) {
  //       studentLessons.forEach((studentLesson) => {
  //         studentLesson.courses.forEach((course) => {
  //           const matchingLesson = course.lessons.find(
  //             (lesson) => lesson.id === lessonId
  //           );
  //           if (matchingLesson) {
  //             setOpenClasses((prev) => ({ ...prev, [studentLesson.id]: true }));
  //             setOpenCourses((prev) => ({ ...prev, [course.id]: true }));
  //           }
  //         });
  //       });
  //     }
  //   }, [lessonId, studentLessons]);

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "fixed",
        top: 0,
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
            placeholder="Search lessons..."
            value={searchLessons}
            onChange={(e) => setSearchLessons(e.target.value)}
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
          {studentLessons.map((studentLesson) => (
            <Box
              key={studentLesson.id}
              sx={{ borderBottom: "1px solid #e0e0e0", boxShadow: 3 }}
            >
              <ListItemButton
                onClick={() =>
                  handleToggle(studentLesson.id, openClasses, setOpenClasses)
                }
              >
                <ListItemText primary={studentLesson.className} />
                {openClasses[studentLesson.id] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
              <Collapse
                in={openClasses[studentLesson.id]}
                timeout="auto"
                unmountOnExit
              >
                {renderCourses(studentLesson.courses)}
              </Collapse>
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default LessonSidebar;
