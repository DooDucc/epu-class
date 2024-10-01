import { Launch as LaunchIcon } from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { ExerciseType } from "../../lesson/types";
import { LessonType } from "../types";
import { SubmitExercise } from "./SubmitExercise";
import { useAppSelector } from "../../base";
import { ROLE } from "../../auth/utils";

interface LessonExerciseProps {
  exercises: ExerciseType[];
  selectedLesson?: LessonType | null;
  completedLessons?: string[];
  setCompletedLessons?: React.Dispatch<React.SetStateAction<string[]>>;
}

const LessonExercise = ({
  exercises,
  selectedLesson,
  completedLessons,
  setCompletedLessons,
}: LessonExerciseProps) => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Box sx={{ boxShadow: theme.shadows[3], p: 2, borderRadius: 2, mt: 2 }}>
      {exercises?.length > 0 && (
        <Box>
          <Typography variant="h6">Exercises</Typography>
          <List disablePadding>
            {exercises?.map((exercise) => (
              <ListItem key={exercise?.id} disablePadding>
                <ListItemButton
                  component="a"
                  href={exercise?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      exercise?.name?.length > 40
                        ? `${exercise?.name.substring(0, 40)}...`
                        : exercise?.name
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {user?.role === ROLE.STUDENT &&
          completedLessons &&
          setCompletedLessons &&
          selectedLesson ? (
            <SubmitExercise
              selectedLesson={selectedLesson}
              completedLessons={completedLessons}
              setCompletedLessons={setCompletedLessons}
            />
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default LessonExercise;
