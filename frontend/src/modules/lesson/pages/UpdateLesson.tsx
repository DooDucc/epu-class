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
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  appPaths,
  COMPONENT_STAGES,
  useAppDispatch,
  useAppSelector,
} from "../../base";
import { AttachmentUpload, ExerciseUpload, LessonVideo } from "../components";
import { getClasses, getLesson, updateLesson } from "../redux/actions";
import { setCreateLesson, setLesson } from "../redux/slice";
import { AttachmentType, ExerciseType } from "../types";

const UpdateLesson = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    createLesson: { courses, videoUrl, uploadState },
    lesson: { updatingLesson },
  } = useAppSelector((state) => state.lesson);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [attachments, setAttachments] = useState<AttachmentType[]>([]);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  useEffect(() => {
    if (id) {
      dispatch(getLesson({ id }));
    }
    dispatch(getClasses());

    return () => {
      dispatch(setLesson({ updatingLesson: null }));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (updatingLesson) {
      setTitle(updatingLesson.title);
      setDesc(updatingLesson.desc);
      setIsPublished(updatingLesson.isPublished);
      setCourseId(updatingLesson.courseId);
      setAttachments(updatingLesson.attachments || []);
      setExercises(updatingLesson.exercises || []);

      dispatch(
        setCreateLesson({
          exercises: updatingLesson.exercises?.map((exercise) => {
            return {
              name: exercise.name,
              url: exercise.url,
              type: exercise.url.includes("res.cloudinary.com")
                ? "file"
                : "link",
            };
          }),
          attachments: updatingLesson.attachments?.map((attachment) => {
            return {
              name: attachment.name,
              url: attachment.url,
              type: attachment.url.includes("res.cloudinary.com")
                ? "file"
                : "link",
            };
          }),
          uploadState: {
            ...uploadState,
            video: updatingLesson.videoUrl ? COMPONENT_STAGES.SUCCESS : "",
            attachment: COMPONENT_STAGES.SUCCESS,
            exercise: COMPONENT_STAGES.SUCCESS,
          },
          videoUrl: updatingLesson.videoUrl,
        })
      );
      setVideoPreview(updatingLesson.videoUrl);
      setVideoDuration(updatingLesson.videoDuration || 0);
    }

    // return () => {
    //   dispatch(
    //     setCreateLesson({
    //       uploadState: {
    //         video: "",
    //         attachment: "",
    //         exercise: "",
    //       },
    //       videoUrl: "",
    //       attachments: [],
    //       exercises: [],
    //     })
    //   );
    // };
  }, [updatingLesson]);

  const onDrop = (acceptedFiles: File[]) => {
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
  };

  const formatDuration = (durationInSeconds: number): number => {
    return Math.floor(durationInSeconds);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      dispatch(
        updateLesson({
          id,
          title,
          desc,
          isPublished,
          videoUrl,
          courseId,
          position: updatingLesson?.position,
          videoDuration,
          handleSuccess: () => {
            toast.success("Lesson is updated successfully");
            navigate(appPaths.TEACHER_LESSON);
          },
          handleFail: () => {
            toast.error("Lesson update failed");
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
            Update Lesson
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
              form="update-lesson-form"
            >
              Update Lesson
            </Button>
          </Box>
        </Box>
        <Box
          component="form"
          id="update-lesson-form"
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
              <FormControl fullWidth margin="normal">
                <InputLabel id="course-select-label">Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  label="Course"
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

export default UpdateLesson;
