import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RichTextEditor, useAppDispatch, useAppSelector } from "../../base";
import { getNote, updateNote } from "../redux/actions";
import { LessonType } from "../types";

interface LessonNoteProps {
  selectedLesson: LessonType;
}

const LessonNote = ({ selectedLesson }: LessonNoteProps) => {
  const dispatch = useAppDispatch();
  const { lessonId } = useParams<{
    lessonId: string;
  }>();

  const {
    courseDetails: { note },
  } = useAppSelector((state) => state.course);
  const { user } = useAppSelector((state) => state.auth);

  const [submissionNote, setSubmissionNote] = useState("");

  useEffect(() => {
    setSubmissionNote("");
    if (lessonId && user?.id) {
      dispatch(getNote({ lessonId, studentId: user?.id || "" }));
    }
  }, [lessonId, user?.id, dispatch]);

  useEffect(() => {
    if (note) {
      setSubmissionNote(note);
    } else {
      setSubmissionNote("");
    }
  }, [note]);

  const handleChangeNote = (content: string) => {
    setSubmissionNote(content);
  };

  const handleSubmitNote = () => {
    dispatch(
      updateNote({
        lessonId: selectedLesson?.id || "",
        studentId: user?.id || "",
        content: submissionNote,
        handleSuccess: () => {
          toast.success("Note updated successfully");
        },
        handleFail: () => {
          toast.error("Failed to update note");
        },
      })
    );
  };

  return (
    <Box mt={1}>
      <Box component="form" noValidate autoComplete="off">
        <RichTextEditor
          value={submissionNote}
          onChange={handleChangeNote}
          isModifyHeight
          isOverlapEnter={false}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitNote}
          disabled={!submissionNote.trim()}
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default LessonNote;
