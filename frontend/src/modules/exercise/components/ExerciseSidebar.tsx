import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Collapse,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../base";
import { Course, Lesson } from "../types";

interface ExerciseSidebarProps {
  handleSelectedLessonExercises: (lesson: Lesson) => void;
}

const ExerciseSidebar = ({
  handleSelectedLessonExercises,
}: ExerciseSidebarProps) => {
  const { lessonId } = useParams();

  const {
    exercise: { data: submittedExercises },
  } = useAppSelector((state) => state.exercise);

  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({});
  const [openCourses, setOpenCourses] = useState<Record<string, boolean>>({});
  const [searchLessons, setSearchLessons] = useState<string>("");

  const handleToggle = (
    id: string,
    _: Record<string, boolean>,
    setOpenState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    setOpenState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderLessons = (lessons: Lesson[]) => (
    <List component="div" disablePadding>
      {lessons.map((lesson) => (
        <ListItemButton
          key={lesson.id}
          sx={{ pl: 6 }}
          onClick={() => handleSelectedLessonExercises(lesson)}
          selected={lesson.id === lessonId}
        >
          <ListItemText primary={lesson.title} />
        </ListItemButton>
      ))}
    </List>
  );

  const renderCourses = (courses: Course[]) => (
    <List component="div" disablePadding>
      {courses.map((course) => (
        <React.Fragment key={course.id}>
          <ListItemButton
            onClick={() => handleToggle(course.id, openCourses, setOpenCourses)}
            sx={{ pl: 4 }}
          >
            <ListItemText primary={course.title} />
            {openCourses[course.id] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCourses[course.id]} timeout="auto" unmountOnExit>
            {renderLessons(course.lessons)}
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );

  useEffect(() => {
    if (lessonId) {
      submittedExercises.forEach((exerciseClass) => {
        exerciseClass.courses.forEach((course) => {
          const matchingLesson = course.lessons.find(
            (lesson) => lesson.id === lessonId
          );
          if (matchingLesson) {
            setOpenClasses((prev) => ({ ...prev, [exerciseClass.id]: true }));
            setOpenCourses((prev) => ({ ...prev, [course.id]: true }));
          }
        });
      });
    }
  }, [lessonId, submittedExercises]);

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
          {submittedExercises.map((exerciseClass) => (
            <Box
              key={exerciseClass.id}
              sx={{ borderBottom: "1px solid #e0e0e0", boxShadow: 3 }}
            >
              <ListItemButton
                onClick={() =>
                  handleToggle(exerciseClass.id, openClasses, setOpenClasses)
                }
              >
                <ListItemText primary={exerciseClass.className} />
                {openClasses[exerciseClass.id] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
              <Collapse
                in={openClasses[exerciseClass.id]}
                timeout="auto"
                unmountOnExit
              >
                {renderCourses(exerciseClass.courses)}
              </Collapse>
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ExerciseSidebar;
