import React from "react";
import { ChatType } from "../types";
import { Grid, Paper } from "@mui/material";
import {
  LessonAttachment,
  LessonChat,
  LessonExercise,
  LessonInfo,
} from "../../course";

interface SelectedLessonChatProps {
  selectedLessonChat: ChatType;
}

const SelectedLessonChat: React.FC<SelectedLessonChatProps> = ({
  selectedLessonChat,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, pl: "320px" }}>
      {selectedLessonChat?.lesson?.videoUrl && (
        <video width="100%" controls src={selectedLessonChat?.lesson?.videoUrl}>
          Your browser does not support the video tag.
        </video>
      )}
      <LessonInfo
        selectedLesson={{
          title: selectedLessonChat?.lesson?.title,
          updatedAt: selectedLessonChat?.lesson?.updatedAt,
          desc: selectedLessonChat?.lesson?.desc,
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <LessonAttachment
            attachments={selectedLessonChat?.lesson?.attachments}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LessonExercise exercises={selectedLessonChat?.lesson?.exercises} />
        </Grid>
      </Grid>
      <LessonChat studentId={selectedLessonChat?.studentId} />
    </Paper>
  );
};

export default SelectedLessonChat;
