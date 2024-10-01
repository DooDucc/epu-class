import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { createLesson } from "../../lesson/redux/actions";
import { getLessons, updateLessonPositions } from "../redux/actions";

interface SubjectLessonsProps {
  courseId: string;
}

const SubjectLessons: React.FC<SubjectLessonsProps> = ({ courseId }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    createCourse: { lessons },
  } = useAppSelector((state) => state.course);

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  const handleAddLesson = () => {
    setIsAddingLesson(true);
  };

  const handleCancelAddLesson = () => {
    setIsAddingLesson(false);
    setNewLessonTitle("");
  };

  const handleCreateLesson = () => {
    if (newLessonTitle.trim()) {
      dispatch(
        createLesson({
          title: newLessonTitle.trim(),
          courseId,
          handleSuccess: () => {
            setNewLessonTitle("");
            setIsAddingLesson(false);
            toast.success("Lesson created successfully");
            dispatch(getLessons({ courseId }));
          },
          handleFail: () => {
            toast.error("Failed to create lesson");
          },
        })
      );
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreateLesson();
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newLessons = Array.from(lessons);
    const [reorderedLesson] = newLessons.splice(source.index, 1);
    newLessons.splice(destination.index, 0, reorderedLesson);

    const updatedLessons = newLessons.map((lesson, index) => ({
      id: lesson.id,
      position: index,
    }));

    dispatch(
      updateLessonPositions({
        courseId,
        lessons: updatedLessons,
        handleSuccess: () => {
          dispatch(getLessons({ courseId }));
        },
        handleFail: () => {
          toast.error("Failed to update lesson order");
        },
      })
    );
  };

  const handleEditLesson = (lessonId: string) => {
    navigate(`${appPaths.TEACHER_LESSON}/${lessonId}`);
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 3,
        bgcolor: "background.paper",
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" color="text.primary">
          Subject Lessons
        </Typography>
        {isAddingLesson ? (
          <Button
            startIcon={<CloseIcon />}
            onClick={handleCancelAddLesson}
            color="primary"
          >
            Cancel
          </Button>
        ) : (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddLesson}
            variant="outlined"
            color="primary"
          >
            Add a lesson
          </Button>
        )}
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lessons">
          {(provided: DroppableProvided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {lessons.map((lesson, index) => (
                <Draggable
                  key={lesson.id}
                  draggableId={lesson.id}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                        p: 1,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DragIndicatorIcon
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography color="text.primary">
                          {lesson.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Chip
                          label={
                            lesson.isPublished ? "Published" : "Unpublished"
                          }
                          color={lesson.isPublished ? "success" : "default"}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => handleEditLesson(lesson.id)}
                          size="small"
                        >
                          Edit
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {isAddingLesson && (
        <Box
          sx={{
            bgcolor: theme.palette.action.hover,
            p: 2,
            borderRadius: 1,
            mt: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="e.g. 'Introduction to the lesson'"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              variant="contained"
              onClick={handleCreateLesson}
              disabled={!newLessonTitle.trim()}
              color="primary"
            >
              Create
            </Button>
          </Box>
        </Box>
      )}

      {lessons.length > 0 && (
        <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
          Drag and drop to reorder the lessons
        </Typography>
      )}
    </Box>
  );
};

export default SubjectLessons;
