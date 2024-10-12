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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { COMPONENT_STAGES } from "../../base/utils";
import { ClassThumbnail } from "../components";
import { getClass, getMajors, updateClass } from "../redux/actions";
import { setCreateClass } from "../redux/slice";

const UpdateClass = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    createClass: { majors, thumbnail },
    class: { updatingClass },
  } = useAppSelector((state) => state.class);

  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [majorId, setMajorId] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getClass({ id }));
    }
    dispatch(getMajors());
  }, [id]);

  useEffect(() => {
    if (updatingClass) {
      setClassCode(updatingClass.classCode);
      setClassName(updatingClass.className);
      setIsPublished(updatingClass.isPublished);
      setMajorId(updatingClass.majorId);

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
          isPublished,
          thumbnailUrl: thumbnail,
          majorId,
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="update-class-form"
          >
            Update Class
          </Button>
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
              <FormControl fullWidth margin="normal">
                <InputLabel id="major-select-label">Major</InputLabel>
                <Select
                  labelId="major-select-label"
                  value={majorId}
                  onChange={(e) => setMajorId(e.target.value)}
                  label="Major"
                >
                  {majors.map((major) => (
                    <MenuItem key={major.id} value={major.id}>
                      {major.name}
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
