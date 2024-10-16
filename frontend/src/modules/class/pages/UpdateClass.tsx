import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { COMPONENT_STAGES } from "../../base/utils";
import { ClassLessons, ClassThumbnail } from "../components";
import { getClass, updateClass } from "../redux/actions";
import { setCreateClass } from "../redux/slice";

const UpdateClass = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    createClass: { thumbnail },
    class: { updatingClass },
  } = useAppSelector((state) => state.class);

  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getClass({ id }));
    }
  }, [id]);

  useEffect(() => {
    if (updatingClass) {
      setClassCode(updatingClass.classCode);
      setClassName(updatingClass.className);
      setIsPublished(updatingClass.isPublished);
      setDesc(updatingClass.desc);
      dispatch(
        setCreateClass({
          uploadState: updatingClass.thumbnail ? COMPONENT_STAGES.SUCCESS : "",
        })
      );
      setThumbnailPreview(updatingClass.thumbnail);
    }

    return () => {
      dispatch(
        setCreateClass({
          uploadState: "",
          thumbnail: "",
        })
      );
    };
  }, [updatingClass]);

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
    if (id) {
      dispatch(
        updateClass({
          id,
          classCode,
          className,
          desc,
          isPublished,
          thumbnailUrl: thumbnail,
          handleSuccess: () => {
            toast.success("Class is updated successfully");
            navigate(appPaths.TEACHER_CLASS);
          },
          handleFail: () => {
            toast.error("Class is updated failed");
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
            Update Class
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
              form="update-class-form"
            >
              Update Class
            </Button>
          </Box>
        </Box>
        <Box
          component="form"
          id="update-class-form"
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
              <ClassLessons classId={id || ""} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClassThumbnail
                thumbnailPreview={thumbnailPreview}
                onDrop={onDrop}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdateClass;
