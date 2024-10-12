import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { AttachmentUpload, ExerciseUpload, LessonVideo } from "../components";
import { createLesson, getClasses } from "../redux/actions";
import { setCreateLesson } from "../redux/slice";

const CreateLesson = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    createLesson: { courses, videoUrl, exercises, attachments },
  } = useAppSelector((state) => state.lesson);

  const { user } = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [videoDuration, setVideoDuration] = useState<number>(0);

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const videoPreviewUrl = e.target?.result as string;
        setVideoPreview(videoPreviewUrl);

        // Create a video element to get the duration
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          const duration = video.duration;
          setVideoDuration(formatDuration(duration));
        };
        video.src = videoPreviewUrl;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const formatDuration = (durationInSeconds: number): number => {
    return Math.floor(durationInSeconds);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      dispatch(
        createLesson({
          title,
          desc,
          isPublished,
          videoUrl,
          courseId,
          exercises,
          attachments,
          videoDuration,
          handleSuccess: () => {
            dispatch(
              setCreateLesson({
                videoUrl: "",
                attachments: [],
                exercises: [],
                uploadState: {
                  video: "",
                  attachment: "",
                  exercise: "",
                },
              })
            );
            toast.success("Lesson is created successfully");
            navigate(appPaths.TEACHER_LESSON);
          },
          handleFail: () => {
            toast.error("Failed to create lesson");
          },
        })
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
        width: "100%",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h4" component="h1" mb={0}>
            Create New Lesson
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
              }
              label="Published"
              sx={{ mr: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              form="create-lesson-form"
            >
              Create Lesson
            </Button>
          </Box>
        </Box>
        <Box
          component="form"
          id="create-lesson-form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Lesson title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                multiline
                rows={4}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="course-select-label">Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  label="Course"
                  required
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Lesson Exercises
              </Typography>
              <ExerciseUpload />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Lesson Video</Typography>
              <LessonVideo videoPreview={videoPreview} onDrop={onDrop} />
              <Typography variant="h6" sx={{ mt: 4 }}>
                Lesson Attachments
              </Typography>
              <AttachmentUpload />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateLesson;
