import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import {
  getCourse,
  getClasses,
  updateCourse,
  getLessons,
} from "../redux/actions";
import {
  Container,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import CourseThumbnail from "../components/CourseThumbnail";
import SubjectLessons from "../components/SubjectLessons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setCourse, setCreateCourse } from "../redux/slice";
import { COMPONENT_STAGES } from "../../base/utils";

const UpdateCourse = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: courseId } = useParams<{ id: string }>();

  const {
    createCourse: { classes, thumbnail },
    course: { updatingCourse },
  } = useAppSelector((state) => state.course);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [classId, setClassId] = useState("");

  useEffect(() => {
    if (courseId) {
      dispatch(getCourse({ id: courseId }));
      dispatch(getLessons({ courseId }));
    }
    dispatch(getClasses());

    return () => {
      dispatch(setCourse({ updatingCourse: null }));
    };
  }, [courseId]);

  useEffect(() => {
    if (updatingCourse) {
      setTitle(updatingCourse.title);
      setDesc(updatingCourse.desc);
      setIsPublished(updatingCourse.isPublished);
      setClassId(updatingCourse.classId);

      dispatch(
        setCreateCourse({
          uploadState: updatingCourse.imageUrl ? COMPONENT_STAGES.SUCCESS : "",
        })
      );
      setThumbnailPreview(updatingCourse.imageUrl);
    }

    return () => {
      dispatch(
        setCreateCourse({
          uploadState: "",
          thumbnail: "",
        })
      );
    };
  }, [updatingCourse]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (courseId) {
      dispatch(
        updateCourse({
          id: courseId,
          title,
          desc,
          isPublished,
          imageUrl: thumbnail,
          classId,
          handleSuccess: () => {
            toast.success("Course is updated successfully");
            navigate(appPaths.TEACHER_SUBJECT);
          },
          handleFail: () => {
            toast.error("Course update failed");
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
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Update Subject
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
              form="update-course-form"
            >
              Update Subject
            </Button>
          </Box>
        </Box>
        <Box
          component="form"
          id="update-course-form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Subject name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                multiline
                rows={3}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="class-select-label">Class</InputLabel>
                <Select
                  labelId="class-select-label"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  label="Class"
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <SubjectLessons courseId={courseId || ""} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Subject Thumbnail
              </Typography>
              <Box sx={{ width: "100%", mx: "auto", mb: 3 }}>
                <CourseThumbnail
                  thumbnailPreview={thumbnailPreview}
                  onDrop={onDrop}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdateCourse;
