import React, { useState, useCallback } from "react";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { createClasses } from "../redux/actions";
import {
  Container,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Grid,
  Modal,
} from "@mui/material";
import { generateClassCode } from "../utils";
import { ClassThumbnail } from "../components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setCreateClass } from "../redux/slice";

const CreateClass = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    createClass: { thumbnail },
  } = useAppSelector((state) => state.class);

  const { user } = useAppSelector((state) => state.auth);

  const [classCode] = useState(generateClassCode());
  const [className, setClassName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdClassId, setCreatedClassId] = useState<string | null>(null);
  const [desc, setDesc] = useState("");

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
        createClasses({
          classCode,
          className,
          isPublished,
          thumbnailUrl: thumbnail,
          teacherId: user.id,
          handleSuccess: (id: string) => {
            dispatch(
              setCreateClass({
                thumbnail: "",
                uploadState: "",
              })
            );
            toast.success("Class is created successfully");
            // navigate(appPaths.TEACHER_CLASS);
            setCreatedClassId(id);
            setIsModalOpen(true);
          },
        })
      );
    }
  };

  const handleCreateLessons = () => {
    if (createdClassId) {
      navigate(`${appPaths.TEACHER_CLASS}/${createdClassId}`);
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
            Create New Class
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
              form="create-class-form"
            >
              Create Class
            </Button>
          </Box>
        </Box>
        <Box
          component="form"
          id="create-class-form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Class Code"
                value={classCode}
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Class Name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
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
            </Grid>
            <Grid item xs={12} md={6}>
              <ClassThumbnail
                thumbnailPreview={thumbnailPreview}
                onDrop={onDrop}
              />
            </Grid>
          </Grid>
        </Box>
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
              Class Created Successfully
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Please create lessons for the class that you just created.
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

export default CreateClass;
