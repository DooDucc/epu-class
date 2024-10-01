import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LinkIcon from "@mui/icons-material/Link";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  COMPONENT_STAGES,
  convertBase64,
  useAppDispatch,
  useAppSelector,
} from "../../../base";
import { uploadFile } from "../../../class/redux/actions";
import { setCreateLesson } from "../../redux/slice";

const DropzoneContainer = styled(Paper)(({ theme }) => ({
  width: 300,
  height: "auto",
  minHeight: 200,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  transition: "border .3s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
  padding: 2,
}));

const ExerciseUpload = () => {
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const {
    createLesson: { uploadState, exercises },
  } = useAppSelector((state) => state.lesson);

  const handleFileChange = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      const newAttachments: { name: string; url: string; type: string }[] = [];

      const uploadPromises = files.map(async (file) => {
        const base64 = await convertBase64(file);
        return dispatch(
          uploadFile({
            file: base64,
            handleUploading: () => {
              dispatch(
                setCreateLesson({
                  uploadState: {
                    ...uploadState,
                    exercise: COMPONENT_STAGES.LOADING,
                  },
                })
              );
            },
            handleSuccess: (fileUrl: string) => {
              newAttachments.push({
                name: file.name,
                url: fileUrl,
                type: "file",
              });
            },
            handleFail: () => {
              dispatch(
                setCreateLesson({
                  uploadState: {
                    ...uploadState,
                    exercise: COMPONENT_STAGES.FAIL,
                  },
                })
              );
            },
          })
        );
      });

      try {
        await Promise.all(uploadPromises);

        dispatch(
          setCreateLesson({
            exercises: [...(exercises || []), ...newAttachments],
            uploadState: {
              ...uploadState,
              exercise: COMPONENT_STAGES.SUCCESS,
            },
          })
        );
      } catch (error) {
        console.error("Error uploading files:", error);
        dispatch(
          setCreateLesson({
            exercises,
            uploadState: {
              ...uploadState,
              exercise: COMPONENT_STAGES.FAIL,
            },
          })
        );
      } finally {
        setIsUploading(false);
      }
    },
    [dispatch, uploadState, exercises]
  );

  const handleDeleteExercise = useCallback(
    (index: number) => {
      dispatch(
        setCreateLesson({
          exercises: exercises.filter((_, i) => i !== index),
        })
      );
    },
    [dispatch, exercises]
  );

  const handleAddLink = () => {
    if (linkUrl) {
      if (isValidUrl(linkUrl)) {
        dispatch(
          setCreateLesson({
            exercises: [
              ...(exercises || []),
              { name: linkUrl, url: linkUrl, type: "link" },
            ],
          })
        );
        setLinkUrl("");
        setLinkError("");
      } else {
        setLinkError("Please enter a valid URL");
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && !isUploading) {
          handleFileChange(acceptedFiles);
        }
      },
      [handleFileChange, isUploading, exercises]
    ),
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    disabled: isUploading,
  });

  return (
    <Box sx={{ width: "100%" }}>
      <DropzoneContainer
        {...getRootProps()}
        elevation={0}
        sx={{
          borderColor: isDragActive ? "primary.main" : "divider",
          backgroundColor: isDragActive ? "action.hover" : "background.default",
          width: "100%",
          height: "auto",
          minHeight: 150,
          padding: 2,
          cursor: isUploading ? "not-allowed" : "pointer",
          pointerEvents: isUploading ? "none" : "auto",
        }}
      >
        <input {...getInputProps()} disabled={isUploading} />
        {isUploading ? (
          <>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Uploading files...
            </Typography>
          </>
        ) : exercises && exercises.length > 0 ? (
          <>
            <List sx={{ width: "100%" }}>
              {exercises.map((exercise, index) => (
                <ListItem
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(exercise.url, "_blank");
                  }}
                >
                  {exercise.type === "link" ? (
                    <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ) : (
                    <InsertDriveFileIcon
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                  )}
                  <ListItemText
                    primary={exercise.name}
                    primaryTypographyProps={{
                      noWrap: true, // Prevent text from wrapping
                      style: {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }, // Add ellipsis for long names
                    }}
                    sx={{
                      flex: "unset",
                    }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExercise(index);
                    }}
                    sx={{ ml: 1 }} // Add a small margin to the left of the delete icon
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Add exercises
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag and drop or click to upload
            </Typography>
          </>
        )}
      </DropzoneContainer>

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Enter link URL"
            value={linkUrl}
            onChange={(e) => {
              setLinkUrl(e.target.value);
              setLinkError("");
            }}
            error={!!linkError}
            helperText={linkError}
            sx={{ mr: 1, flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleAddLink}
            disabled={!linkUrl}
          >
            Add Link
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ExerciseUpload;
