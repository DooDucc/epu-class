import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../base";
import Lessons from "./Lessons";
import { LessonType } from "../types";

interface CourseDetailsSidebarProps {
  publishedLessons: LessonType[];
  completedLessons: string[];
  selectedLesson: LessonType;
  handleLessonSelect: (lesson: LessonType) => void;
}

const CourseDetailsSidebar = ({
  publishedLessons,
  completedLessons,
  selectedLesson,
  handleLessonSelect,
}: CourseDetailsSidebarProps) => {
  const {
    course: { updatingCourse },
  } = useAppSelector((state) => state.course);

  return (
    <Box
      sx={{
        width: 250,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "sticky",
        top: 0,
      }}
    >
      <Typography variant="h6" sx={{ p: 1, textAlign: "center", boxShadow: 3 }}>
        {updatingCourse?.title}
      </Typography>
      <Lessons
        publishedLessons={publishedLessons}
        completedLessons={completedLessons}
        selectedLesson={selectedLesson}
        handleLessonSelect={handleLessonSelect}
      />
    </Box>
  );
};

export default CourseDetailsSidebar;
