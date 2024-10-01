import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  COMPONENT_STAGES,
  convertBase64,
  useAppDispatch,
  useAppSelector,
} from "../../../base";
import { uploadFile } from "../../../class/redux/actions";
import { setCreateLesson } from "../../redux/slice";

type LessonVideoProps = {
  videoPreview: string | null;
  onDrop: (acceptedFiles: File[]) => void;
};

const LessonVideo: React.FC<LessonVideoProps> = ({ videoPreview, onDrop }) => {
  const dispatch = useAppDispatch();

  const {
    createLesson: { uploadState },
  } = useAppSelector((state) => state.lesson);

  const isUploading = uploadState.video === COMPONENT_STAGES.LOADING;

  const handleFileChange = useCallback(
    async (file: File) => {
      onDrop([file]);
      const base64 = await convertBase64(file);
      dispatch(
        uploadFile({
          file: base64,
          handleUploading: () => {
            dispatch(
              setCreateLesson({
                uploadState: {
                  ...uploadState,
                  video: COMPONENT_STAGES.LOADING,
                },
              })
            );
          },
          handleSuccess: (videoUrl: string) => {
            dispatch(
              setCreateLesson({
                videoUrl,
                uploadState: {
                  ...uploadState,
                  video: COMPONENT_STAGES.SUCCESS,
                },
              })
            );
          },
          handleFail: () => {
            dispatch(
              setCreateLesson({
                uploadState: {
                  ...uploadState,
                  video: COMPONENT_STAGES.FAIL,
                },
              })
            );
          },
        })
      );
    },
    [onDrop, dispatch, uploadState]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && !isUploading) {
          handleFileChange(acceptedFiles[0]);
        }
      },
      [handleFileChange, isUploading]
    ),
    accept: { "video/*": [] },
    multiple: false,
    disabled: isUploading,
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        elevation={2}
        sx={{
          p: 2,
          textAlign: "center",
          cursor: isUploading ? "default" : "pointer",
          bgcolor: "background.default",
          position: "relative",
        }}
      >
        <input {...getInputProps()} disabled={isUploading} />
        {isUploading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Uploading video...</Typography>
          </Box>
        ) : videoPreview ? (
          <Box
            component="video"
            src={videoPreview}
            controls
            sx={{ width: "100%" }}
          >
            Your browser does not support the video tag.
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
            }}
          >
            <AddPhotoAlternateIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography>
              {isDragActive ? "Drop the video here" : "Add a video"}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default LessonVideo;
