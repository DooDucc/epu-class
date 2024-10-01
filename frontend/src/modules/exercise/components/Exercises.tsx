import { ExerciseItem } from "../types";
import { Box } from "@mui/material";
import ExerciseCards from "./ExerciseCards";

interface ExerciseProps {
  selectedLessonExercises: ExerciseItem[];
}

const Exercises = ({ selectedLessonExercises }: ExerciseProps) => {
  return (
    <Box sx={{ padding: 2, pl: "320px" }}>
      <ExerciseCards exercises={selectedLessonExercises} />
    </Box>
  );
};

export default Exercises;
