import { Box, Card, CardContent, Typography, Grid, Chip } from "@mui/material";
import { StudentLessonType } from "../../types";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../../../base";

interface StudentLessonsProps {
  selectedStudentLessons: StudentLessonType[];
}

const StudentLessons = ({ selectedStudentLessons }: StudentLessonsProps) => {
  const navigate = useNavigate();

  const handleLessonClick = (lesson: StudentLessonType) => {
    navigate(
      `${appPaths.STUDENT_COURSE}/${lesson.courseId}/lessons/${lesson.id}`
    );
  };

  return (
    <Box sx={{ padding: 2, pl: "320px" }}>
      <Grid container spacing={2}>
        {selectedStudentLessons.map((lesson, index) => {
          const isCompleted =
            lesson.userProgress?.[0]?.isCompleted &&
            lesson.userProgress?.[0]?.lessonId === lesson?.id;
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              onClick={() => handleLessonClick(lesson)}
            >
              <Card sx={{ cursor: "pointer" }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h6">{lesson.title}</Typography>
                    {isCompleted && (
                      <Chip label="Completed" color="success" size="small" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {lesson.desc}
                  </Typography>
                  <video
                    src={lesson.videoUrl || ""}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginTop: "auto",
                    }}
                    controls
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StudentLessons;
