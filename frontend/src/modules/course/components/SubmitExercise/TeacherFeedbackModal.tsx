import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import ReactQuill from "react-quill";
import { useAppSelector } from "../../../base";
import "./index.css";

interface TeacherFeedbackModalProps {
  openTeacherFeedbackModal: boolean;
  setOpenTeacherFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeacherFeedbackModal = ({
  openTeacherFeedbackModal,
  setOpenTeacherFeedbackModal,
}: TeacherFeedbackModalProps) => {
  const {
    courseDetails: { submittedExercise },
  } = useAppSelector((state) => state.course);

  return (
    <Dialog
      open={openTeacherFeedbackModal}
      onClose={() => setOpenTeacherFeedbackModal(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Teacher Feedback</Typography>
        <CloseIcon
          onClick={() => setOpenTeacherFeedbackModal(false)}
          sx={{ cursor: "pointer" }}
        />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            Point:{" "}
          </Typography>
          <Typography variant="h6">{submittedExercise?.point}</Typography>
        </Box>
        <Typography variant="h6">Comment</Typography>
        <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "4px", p: 1 }}>
          <ReactQuill
            value={submittedExercise?.comment}
            readOnly={true}
            theme="bubble"
            modules={{ toolbar: false }}
            className="message-content"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherFeedbackModal;
