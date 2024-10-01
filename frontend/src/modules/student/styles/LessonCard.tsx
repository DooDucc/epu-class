/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { Card, CardContent, Typography, Box, Chip, Link } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { StudentDetailLesson } from "../types";

interface LessonCardProps {
  lesson: StudentDetailLesson;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  return (
    <Card
      sx={{
        m: 1,
        width: 280,
        height: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="h6" noWrap sx={{ maxWidth: "70%" }}>
            {lesson.title}
          </Typography>
          {lesson.isCompleted ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="Completed"
              size="small"
              color="success"
            />
          ) : (
            <Chip
              icon={<PlayCircleOutlineIcon />}
              label="In Progress"
              size="small"
              color="primary"
            />
          )}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {lesson.desc}
        </Typography>
        <Box sx={{ mt: "auto" }}>
          <video
            src={lesson.videoUrl || ""}
            style={{
              width: "100%",
              borderRadius: "10px",
              marginBottom: "10px",
              marginTop: "auto",
            }}
            controls
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <VideoLibraryIcon color="primary" sx={{ mr: 1 }} />
            {/* @ts-ignore */}
            <Link
              href={lesson.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: "none",
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Typography variant="body2">Watch Video</Typography>
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
