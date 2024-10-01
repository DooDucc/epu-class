/* eslint-disable react-hooks/exhaustive-deps */
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LinkIcon from "@mui/icons-material/Link";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Link as MuiLink,
  Tooltip,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { convertBase64, useAppDispatch, useAppSelector } from "../../../base";
import { uploadFile } from "../../../class/redux/actions";
import {
  getSubmittedExercise,
  submitExercise,
  updateLessonProgress,
} from "../../redux/actions";
import { setCourseDetails } from "../../redux/slice";
import { LessonType } from "../../types";
import { truncateLink } from "../../utils";
import SubmitLinkModal from "./SubmitLinkModal";
import TeacherFeedbackModal from "./TeacherFeedbackModal";

interface SubmitExerciseProps {
  selectedLesson: LessonType | null;
  completedLessons: string[];
  setCompletedLessons: React.Dispatch<React.SetStateAction<string[]>>;
}

const SubmitExercise = ({
  selectedLesson,
  completedLessons,
  setCompletedLessons,
}: SubmitExerciseProps) => {
  const dispatch = useAppDispatch();
  const { lessonId } = useParams<{
    lessonId: string;
  }>();

  const {
    courseDetails: { submittedExercise },
  } = useAppSelector((state) => state.course);
  const { user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const [openTeacherFeedbackModal, setOpenTeacherFeedbackModal] =
    useState(false);

  const [submittedItems, setSubmittedItems] = useState<
    Array<{ name: string; url: string; type: string }>
  >([]);

  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    error: string | null;
  }>({
    isUploading: false,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(setCourseDetails({ submittedExercise: null }));
    setSubmittedItems([]);
    if (lessonId && user?.id) {
      dispatch(getSubmittedExercise({ lessonId, studentId: user?.id }));
    }
  }, [lessonId, user?.id]);

  useEffect(() => {
    if (submittedExercise) {
      const exercises = JSON.parse(submittedExercise.exercises)?.map(
        (exercise: { name: string; url: string; type: string }) => ({
          name: exercise.name,
          url: exercise.url,
          type: exercise.type,
        })
      );
      setSubmittedItems(exercises);
    }
  }, [submittedExercise]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const uploadPromises = files.map(async (file) => {
        const base64 = await convertBase64(file);
        return new Promise<string>((resolve, reject) => {
          dispatch(
            uploadFile({
              file: base64,
              handleUploading: () => {
                setUploadState({
                  isUploading: true,
                  error: null,
                });
              },
              handleSuccess: (fileUrl: string) => {
                setUploadState((prevState) => ({
                  ...prevState,
                  isUploading: false,
                }));
                resolve(fileUrl);
              },
              handleFail: () => {
                setUploadState({
                  isUploading: false,
                  error: `Failed to upload ${file.name}`,
                });
                reject(new Error(`Failed to upload ${file.name}`));
              },
            })
          );
        });
      });

      try {
        const uploadedFileUrls = await Promise.all(uploadPromises);
        setSubmittedItems([
          ...submittedItems,
          ...uploadedFileUrls.map((url, index) => ({
            name: files[index].name,
            url: url,
            type: "file",
          })),
        ]);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  const handleSubmit = () => {
    if (lessonId && user?.id) {
      dispatch(
        submitExercise({
          lessonId,
          studentId: user?.id,
          teacherId: selectedLesson?.teacherId || "",
          exercises: submittedItems?.map((item) => ({
            name: item.name,
            url: item.url,
            type: item.type,
          })),
          handleSuccess: () => {
            setSubmittedItems([]);
            setAnchorEl(null);
            toast.success("Exercise submitted successfully");
            if (lessonId && user?.id) {
              dispatch(getSubmittedExercise({ lessonId, studentId: user?.id }));
            }
            if (
              selectedLesson &&
              !completedLessons.includes(selectedLesson.id)
            ) {
              const updatedCompletedLessons = [
                ...completedLessons,
                selectedLesson.id,
              ];
              setCompletedLessons(updatedCompletedLessons);

              dispatch(
                updateLessonProgress({
                  lessonId: selectedLesson.id,
                  studentId: user?.id || "",
                  isCompleted: true,
                })
              );
            }
          },
          handleFail: () => {
            setSubmittedItems([]);
            setAnchorEl(null);
            toast.error("Failed to submit exercise");
          },
        })
      );
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    handleClose();
    if (option === "Submit link") {
      setOpenLinkModal(true);
    } else if (option === "Submit files") {
      fileInputRef.current?.click();
    }
  };

  const handleViewFeedback = () => {
    setOpenTeacherFeedbackModal(true);
  };

  const renderItem = (
    item: { name: string; url: string; type: string },
    index: number
  ) => {
    const commonSx = {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "action.hover",
        transition: "background-color 0.3s",
      },
    };

    if (item.type === "link") {
      return (
        <ListItem key={`link-${index}`} sx={commonSx}>
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText>
            <Tooltip title={item?.url} arrow>
              <MuiLink
                href={item?.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  color: "text.primary",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {truncateLink(item?.url, 50)}
              </MuiLink>
            </Tooltip>
          </ListItemText>
        </ListItem>
      );
    } else {
      return (
        <ListItem
          key={`file-${index}`}
          onClick={() => window.open(item.url, "_blank")}
          sx={commonSx}
        >
          <ListItemIcon>
            <InsertDriveFileIcon />
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{ noWrap: true }}
          />
        </ListItem>
      );
    }
  };

  return (
    <Box mt={1}>
      <Typography variant="h6" gutterBottom>
        Submit Your Exercise
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<ArrowDropDownIcon />}
          sx={{ width: "fit-content", justifyContent: "space-between" }}
          disabled={uploadState.isUploading}
        >
          {submittedItems.length > 0
            ? "Add More"
            : selectedOption || "Submission Type"}
        </Button>
        {submittedItems.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={uploadState.isUploading}
          >
            Submit
          </Button>
        )}
        {(submittedExercise?.comment || submittedExercise?.point) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewFeedback}
            disabled={uploadState.isUploading}
          >
            View Feedback
          </Button>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: 150,
            },
          }}
        >
          <MenuItem onClick={() => handleOptionSelect("Submit files")}>
            Files
          </MenuItem>
          <MenuItem onClick={() => handleOptionSelect("Submit link")}>
            Link
          </MenuItem>
        </Menu>
      </Box>

      <input
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {uploadState.isUploading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {uploadState.error && (
        <Box sx={{ mt: 2, color: "error.main" }}>
          <Typography variant="body2">{uploadState.error}</Typography>
        </Box>
      )}

      {submittedItems.length > 0 && (
        <Box mt={2}>
          <Typography variant="body1">Submitted Items</Typography>
          <List disablePadding>
            {submittedItems.map((item, index) => renderItem(item, index))}
          </List>
        </Box>
      )}

      <SubmitLinkModal
        openLinkModal={openLinkModal}
        setOpenLinkModal={setOpenLinkModal}
        setSubmittedItems={setSubmittedItems}
      />

      <TeacherFeedbackModal
        openTeacherFeedbackModal={openTeacherFeedbackModal}
        setOpenTeacherFeedbackModal={setOpenTeacherFeedbackModal}
      />
    </Box>
  );
};

export default SubmitExercise;
