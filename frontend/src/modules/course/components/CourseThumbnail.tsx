import React, { useRef, useCallback } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  alpha,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import { useDropzone } from "react-dropzone";
import { useAppDispatch, useAppSelector, convertBase64 } from "../../base";
import { uploadFile } from "../../class/redux/actions";
import { COMPONENT_STAGES } from "../../base/utils/constants";
import { setCreateCourse } from "../redux/slice";

interface CourseThumbnailProps {
  thumbnailPreview: string | null;
  onDrop: (acceptedFiles: File[]) => void;
}

const CourseThumbnail: React.FC<CourseThumbnailProps> = ({
  thumbnailPreview,
  onDrop,
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    createCourse: { uploadState },
  } = useAppSelector((state) => state.course);

  const handleFileChange = useCallback(
    async (file: File) => {
      onDrop([file]);
      const base64 = await convertBase64(file);
      dispatch(
        uploadFile({
          file: base64,
          handleUploading: () => {
            dispatch(
              setCreateCourse({
                uploadState: COMPONENT_STAGES.LOADING,
              })
            );
          },
          handleSuccess: (thumbnail: string) => {
            dispatch(
              setCreateCourse({
                thumbnail,
                uploadState: COMPONENT_STAGES.SUCCESS,
              })
            );
          },
          handleFail: () => {
            dispatch(
              setCreateCourse({
                thumbnail: "",
                uploadState: COMPONENT_STAGES.FAIL,
              })
            );
          },
        })
      );
    },
    [onDrop, dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          handleFileChange(acceptedFiles[0]);
        }
      },
      [handleFileChange]
    ),
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  const renderContent = () => {
    switch (uploadState) {
      case COMPONENT_STAGES.LOADING:
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Uploading...</Typography>
          </Box>
        );
      case COMPONENT_STAGES.SUCCESS:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1">Subject image</Typography>
              <IconButton onClick={handleEditImage} size="small">
                <EditIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  Edit image
                </Typography>
              </IconButton>
            </Box>
            <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
              <img
                src={thumbnailPreview || ""}
                alt="Class thumbnail"
                style={{
                  width: "100%",
                  display: "block",
                  aspectRatio: "16 / 9",
                }}
              />
            </Box>
          </Box>
        );
      case COMPONENT_STAGES.FAIL:
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "error.main",
            }}
          >
            <ErrorIcon sx={{ mr: 1 }} />
            <Typography>Failed to upload image. Please try again.</Typography>
          </Box>
        );
      default:
        return (
          <>
            <input {...getInputProps()} onChange={handleInputChange} />
            <CloudUploadIcon
              sx={{ fontSize: 48, color: "action.active", mr: 1 }}
            />
            <Typography>
              {isDragActive
                ? "Drop the image here"
                : "Choose files or drag and drop"}
            </Typography>
          </>
        );
    }
  };

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 2,
        mt: 2,
        mb: 2,
        border: "2px dashed #ccc",
        borderRadius: 2,
        cursor: "pointer",
        textAlign: "center",
        "&:hover": {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "16 / 9",
      }}
    >
      {renderContent()}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        style={{ display: "none" }}
        accept="image/*"
      />
    </Paper>
  );
};

export default CourseThumbnail;
