import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import {
  Check as CheckIcon,
  Lock as LockIcon,
  VideoLibrary as VideoIcon,
} from "@mui/icons-material";
import { formatDuration } from "../../class/utils";
import { LessonType } from "../../lesson/types";

const Lessons = ({
  publishedLessons,
  completedLessons,
  selectedLesson,
  handleLessonSelect,
}: {
  publishedLessons: LessonType[];
  completedLessons: string[];
  selectedLesson: LessonType | null;
  handleLessonSelect: (lesson: LessonType) => void;
}) => {
  const theme = useTheme();

  return (
    <List sx={{ flex: 1, overflowY: "auto" }}>
      {publishedLessons?.map((lesson, index: number) => {
        const isCompleted = completedLessons?.includes(lesson.id);
        const isLocked =
          index !== 0 &&
          !isCompleted &&
          !completedLessons?.includes(publishedLessons[index - 1]?.id);

        return (
          <ListItem key={lesson.id} disablePadding>
            <ListItemButton
              onClick={() => handleLessonSelect(lesson)}
              selected={lesson.id === selectedLesson?.id}
              disabled={isLocked}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                transition: theme.transitions.create(
                  ["background-color", "color"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <ListItemText
                  primary={`${index + 1}. ${lesson.title}`}
                  primaryTypographyProps={{
                    style: {
                      fontWeight:
                        lesson.id === selectedLesson?.id ? "bold" : "normal",
                    },
                  }}
                />
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <VideoIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {formatDuration(lesson.videoDuration) || "N/A"}
                  </Typography>
                </Box>
              </Box>
              {isCompleted && <CheckIcon color="success" />}
              {isLocked && <LockIcon color="action" />}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Lessons;
