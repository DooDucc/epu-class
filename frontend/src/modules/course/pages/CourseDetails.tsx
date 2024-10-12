/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Drawer, Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { setLesson } from "../../lesson";
import { LessonType } from "../../lesson/types";
import CourseDetailsSidebar from "../components/CourseDetailsSidebar";
import LessonAttachment from "../components/LessonAttachment";
import LessonChat from "../components/LessonChat";
import LessonExercise from "../components/LessonExercise";
import LessonInfo from "../components/LessonInfo";
import LessonNote from "../components/LessonNote";
import { getCourse, updateLessonProgress } from "../redux/actions";
import { setCourse } from "../redux/slice";

const CourseDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: courseId, lessonId } = useParams<{
    id: string;
    lessonId: string;
  }>();
  const theme = useTheme();

  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);

  const {
    course: { updatingCourse },
  } = useAppSelector((state) => state.course);
  const { user } = useAppSelector((state) => state.auth);

  const publishedLessons =
    updatingCourse?.lessons?.filter((lesson) => lesson.isPublished) || [];

  useEffect(() => {
    if (courseId) {
      dispatch(getCourse({ id: courseId }));
    }

    return () => {
      dispatch(setCourse({ data: [] }));
    };
  }, [courseId]);

  useEffect(() => {
    if (
      !selectedLesson &&
      updatingCourse?.lessons &&
      updatingCourse?.lessons?.length > 0
    ) {
      const completed = updatingCourse.lessons
        .filter((lesson) =>
          lesson.userProgress?.some(
            (progress) => progress.studentId === user?.id
          )
        )
        .map((lesson) => lesson.id);

      // Only update if the completed lessons have changed
      if (JSON.stringify(completed) !== JSON.stringify(completedLessons)) {
        setCompletedLessons(completed);
      }

      if (lessonId) {
        const lesson = updatingCourse?.lessons.find(
          (lesson) => lesson.id === lessonId
        );
        if (lesson) {
          setSelectedLesson(lesson);
        }
        return;
      }

      // New logic to set the selected lesson
      const lastCompletedIndex = publishedLessons.findIndex(
        (lesson, index: number) => {
          const nextLesson = publishedLessons[index + 1];
          return (
            completed.includes(lesson.id) &&
            (!nextLesson || !completed.includes(nextLesson.id))
          );
        }
      );

      let newSelectedLesson;
      if (lastCompletedIndex === -1) {
        // No completed lessons, select the first lesson
        newSelectedLesson = publishedLessons[0] || null;
      } else {
        // Select the lesson next to the last completed one
        newSelectedLesson =
          publishedLessons[lastCompletedIndex + 1] ||
          publishedLessons[lastCompletedIndex];
      }

      // Only set the selected lesson if none is currently selected
      if (newSelectedLesson) {
        dispatch(
          setLesson({
            updatingLesson: newSelectedLesson,
          })
        );
        setSelectedLesson(newSelectedLesson);
        navigate(
          `${appPaths.STUDENT_COURSE}/${courseId}/lessons/${newSelectedLesson.id}`,
          {
            replace: true,
          }
        );
      }
    }
  }, [updatingCourse, user, publishedLessons, selectedLesson, lessonId]);

  const handleLessonSelect = (lesson: LessonType) => {
    dispatch(
      setLesson({
        updatingLesson: lesson,
      })
    );
    setSelectedLesson(lesson);
    navigate(`${appPaths.STUDENT_COURSE}/${courseId}/lessons/${lesson.id}`);
  };

  const handleEndVideo = () => {
    if (selectedLesson && !completedLessons.includes(selectedLesson.id)) {
      const updatedCompletedLessons = [...completedLessons, selectedLesson.id];
      setCompletedLessons(updatedCompletedLessons);

      dispatch(
        updateLessonProgress({
          lessonId: selectedLesson.id,
          studentId: user?.id || "",
          isCompleted: true,
        })
      );
    }
  };

  const handleOpenNote = () => {
    setIsNoteDrawerOpen(true);
  };

  const handleCloseNote = () => {
    setIsNoteDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <CourseDetailsSidebar
        publishedLessons={publishedLessons}
        completedLessons={completedLessons}
        selectedLesson={selectedLesson}
        handleLessonSelect={handleLessonSelect}
      />

      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          boxShadow: theme.shadows[3],
        }}
      >
        {selectedLesson ? (
          <Paper elevation={3} sx={{ p: 2 }}>
            {selectedLesson?.videoUrl && (
              <video
                width="100%"
                controls
                src={selectedLesson?.videoUrl}
                onEnded={handleEndVideo}
              >
                Your browser does not support the video tag.
              </video>
            )}

            <LessonInfo
              selectedLesson={selectedLesson}
              handleOpenNote={handleOpenNote}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LessonAttachment
                  attachments={selectedLesson.attachments || []}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LessonExercise
                  exercises={selectedLesson.exercises || []}
                  selectedLesson={selectedLesson}
                  completedLessons={completedLessons}
                  setCompletedLessons={setCompletedLessons}
                />
              </Grid>
            </Grid>

            <LessonChat teacherId={selectedLesson?.teacherId} />
          </Paper>
        ) : (
          <Typography variant="body1">
            Select a lesson to view details
          </Typography>
        )}
      </Box>

      <Drawer
        anchor="right"
        open={isNoteDrawerOpen}
        onClose={handleCloseNote}
        sx={{
          "& .MuiDrawer-paper": { width: "40%", maxWidth: "500px", padding: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Add Note</Typography>
          <Button onClick={handleCloseNote}>Close</Button>
        </Box>
        {selectedLesson && <LessonNote selectedLesson={selectedLesson} />}
      </Drawer>
    </Box>
  );
};

export default CourseDetails;
