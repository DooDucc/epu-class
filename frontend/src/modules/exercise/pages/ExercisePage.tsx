/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { Exercises, ExerciseSidebar } from "../components";
import { getSubmittedExercises } from "../redux/actions";
import { ExerciseItem, Lesson } from "../types";

const ExercisePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { lessonId } = useParams();

  const {
    exercise: { data: submittedExercises },
  } = useAppSelector((state) => state.exercise);

  const [selectedLessonExercises, setSelectedLessonExercises] = useState<
    ExerciseItem[]
  >([]);

  useEffect(() => {
    dispatch(getSubmittedExercises());
  }, []);

  useEffect(() => {
    if (lessonId) {
      submittedExercises.forEach((exerciseClass) => {
        exerciseClass.courses.forEach((course) => {
          const matchingLesson = course.lessons.find(
            (lesson) => lesson.id === lessonId
          );
          if (matchingLesson) {
            setSelectedLessonExercises(matchingLesson.exercisesSubmitted);
          }
        });
      });
    }
  }, [lessonId, submittedExercises]);

  const handleSelectedLessonExercises = (lesson: Lesson) => {
    navigate(`${appPaths.TEACHER_EXERCISE}/${lesson.id}`);
  };

  return (
    <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <ExerciseSidebar
        handleSelectedLessonExercises={handleSelectedLessonExercises}
      />
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {selectedLessonExercises?.length > 0 ? (
          <Exercises selectedLessonExercises={selectedLessonExercises} />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              pl: "320px",
            }}
          >
            <Typography variant="body1">
              Select a lesson's exercise to start
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExercisePage;
