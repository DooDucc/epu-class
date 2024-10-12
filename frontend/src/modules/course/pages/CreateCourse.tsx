import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { createCourse, getClasses } from "../redux/actions";
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
  Modal,
} from "@mui/material";
import { toast } from "react-toastify";
import { setCreateCourse } from "../redux/slice";
import CourseThumbnail from "../components/CourseThumbnail";

const CreateCourse = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    createCourse: { classes, thumbnail },
  } = useAppSelector((state) => state.course);

  const { user } = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [classId, setClassId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdSubjectId, setCreatedSubjectId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

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
    if (user) {
      dispatch(
        createCourse({
          title,
          desc,
          isPublished,
          imageUrl: thumbnail,
          classId,
          teacherId: user.id,
          handleSuccess: (id: string) => {
            dispatch(
              setCreateCourse({
                thumbnail: "",
                uploadState: "",
              })
            );
            toast.success("Course is created successfully");
            setCreatedSubjectId(id);
            setIsModalOpen(true);
          },
        })
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateLessons = () => {
    if (createdSubjectId) {
      navigate(`${appPaths.TEACHER_SUBJECT}/${createdSubjectId}`);
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
            Create New Subject
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="create-course-form"
          >
            Create Subject
          </Button>
        </Box>
        <Box
          component="form"
          id="create-course-form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Subject title"
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
                <InputLabel id="category-select-label">Class</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  label="Category"
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                }
                label="Published"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CourseThumbnail
                thumbnailPreview={thumbnailPreview}
                onDrop={onDrop}
              />
            </Grid>
          </Grid>
        </Box>
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Subject Created Successfully
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Please create lessons for the subject that you just created.
            </Typography>
            <Button
              onClick={handleCreateLessons}
              variant="contained"
              sx={{ mt: 3 }}
            >
              Create Lessons
            </Button>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default CreateCourse;
