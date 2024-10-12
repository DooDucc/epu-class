import React, { useEffect, useState } from "react";
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
import {
  StudentCourseType,
  StudentCourse,
  StudentLessonType,
} from "../../types";

interface CourseSidebarProps {
  handleSelectedStudentCourses: (
    lesson: StudentLessonType[],
    courseId: string
  ) => void;
}

const CourseSidebar = ({
  handleSelectedStudentCourses,
}: CourseSidebarProps) => {
  const { courseId } = useParams();

  const {
    studentCourse: { data: studentCourses },
  } = useAppSelector((state) => state.lesson);

  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({});
  const [searchCourses, setSearchCourses] = useState<string>("");
  const [filteredData, setFilteredData] = useState<StudentCourse[]>([]);

  useEffect(() => {
    if (searchCourses) {
      const filteredData = studentCourses.filter((studentLesson) =>
        studentLesson.courses.some((course) =>
          course.title.toLowerCase().includes(searchCourses.toLowerCase())
        )
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(studentCourses);
    }
  }, [searchCourses, studentCourses]);

  useEffect(() => {
    setFilteredData(studentCourses);
  }, [studentCourses]);

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
          onClick={() =>
            handleSelectedStudentCourses(course.lessons, course.id)
          }
          selected={course.id === courseId}
        >
          <ListItemText primary={course.title} />
        </ListItemButton>
      ))}
    </List>
  );

  useEffect(() => {
    if (courseId) {
      studentCourses.forEach((studentLesson) => {
        studentLesson.courses.forEach((course) => {
          if (course.id === courseId) {
            setOpenClasses((prev) => ({ ...prev, [studentLesson.id]: true }));
            handleSelectedStudentCourses(course.lessons, course.id);
          }
        });
      });
    }
  }, [courseId, studentCourses]);

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
            placeholder="Search courses..."
            value={searchCourses}
            onChange={(e) => setSearchCourses(e.target.value)}
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

export default CourseSidebar;
