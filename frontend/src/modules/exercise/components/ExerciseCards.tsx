/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../base";
import RichTextEditor from "../../base/components/RichTextEditor";
import { getSubmittedExerciseById, updateExercise } from "../redux/actions";
import { ExerciseItem } from "../types/sliceTypes";
import { setSubmittedExercises } from "../redux/slice";

interface ExerciseCardsProps {
  exercises: ExerciseItem[];
}

const ExerciseCards: React.FC<ExerciseCardsProps> = ({ exercises }) => {
  const dispatch = useAppDispatch();

  const {
    exercise: { updatingExercise },
  } = useAppSelector((state) => state.exercise);

  const [comment, setComment] = useState("");
  const [point, setPoint] = useState<string>("");

  useEffect(() => {
    if (updatingExercise) {
      setComment(updatingExercise.comment || "");
      setPoint(updatingExercise.point || "");
    }
  }, [updatingExercise]);

  const handleItemClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleExerciseClick = (exercise: ExerciseItem) => {
    dispatch(getSubmittedExerciseById(exercise.id));
  };

  const handleCloseModal = () => {
    dispatch(setSubmittedExercises({ updatingExercise: null }));
    setComment("");
  };

  const handleCommentChange = (content: string) => {
    setComment(content);
  };

  const handleSubmitComment = () => {
    dispatch(
      updateExercise({
        id: updatingExercise?.id as string,
        exercises: updatingExercise?.exercises as string,
        comment,
        point,
        handleSuccess: () => {
          toast.success("Exercise updated successfully");
          handleCloseModal();
        },
        handleError: () => {
          toast.error("Failed to update exercise");
        },
      })
    );
  };

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 10)) {
      setPoint(value);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {exercises.map((exercise) => {
          const exerciseData = JSON.parse(exercise.exercises);
          const hasPoint =
            exercise.point !== null &&
            exercise.point !== undefined &&
            exercise.point !== "";

          return (
            <Grid item xs={12} sm={6} md={4} key={exercise.id}>
              <Card
                onClick={() => handleExerciseClick(exercise)}
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                {hasPoint && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "success.main",
                      color: "white",
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon />
                  </Box>
                )}
                <CardContent sx={{ paddingBottom: "12px !important" }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={exercise.studentAvatar} />
                    <Typography variant="h6">
                      {exercise.studentFullName}
                    </Typography>
                  </Box>
                  <Typography variant="h6" mt={1}>
                    Exercises:
                  </Typography>
                  {exerciseData.map((item: any, index: number) => (
                    <Typography
                      key={index}
                      onClick={(e) => handleItemClick(e, item.url)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          color: "primary.main",
                        },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {item.name}
                    </Typography>
                  ))}
                  {hasPoint && (
                    <Typography
                      variant="h6"
                      sx={{
                        color: "success.main",
                        fontWeight: "bold",
                      }}
                    >
                      Point: {exercise.point}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Modal open={!!updatingExercise} onClose={handleCloseModal}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 600,
            maxHeight: "90vh",
            overflow: "auto",
            p: 2,
          }}
        >
          {updatingExercise && (
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Avatar src={updatingExercise.studentAvatar} />
                  <Typography variant="h6">
                    {updatingExercise.studentFullName}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2">Point</Typography>
                  <TextField
                    value={point}
                    onChange={handlePointChange}
                    sx={{ width: 70 }}
                    type="text"
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: 10,
                        pattern: "^([0-9]|10)$",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="h6" gutterBottom>
                Exercises:
              </Typography>
              {JSON.parse(updatingExercise.exercises).map(
                (item: any, index: number) => (
                  <Typography
                    key={index}
                    onClick={(e) => handleItemClick(e, item.url)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { color: "primary.main" },
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    {item.name}
                  </Typography>
                )
              )}
              <Typography variant="h6" mt={1}>
                Add Comment:
              </Typography>
              <RichTextEditor
                value={comment}
                onChange={handleCommentChange}
                isModifyHeight={true}
                isOverlapEnter={false}
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitComment}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default ExerciseCards;
