import { Box, Typography, Button, useTheme } from "@mui/material";

interface LessonInfoProps {
  selectedLesson: {
    title: string;
    updatedAt: string;
    desc: string;
  };
  handleOpenNote?: () => void;
}

const LessonInfo = ({ selectedLesson, handleOpenNote }: LessonInfoProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: theme.shadows[3],
        p: 1,
        borderRadius: theme.shape.borderRadius,
        mt: 1,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          gutterBottom
          mt={2}
          sx={{ fontWeight: "bold" }}
        >
          {selectedLesson?.title}
        </Typography>
        <Typography variant="body2" paragraph>
          Updated at:{" "}
          {selectedLesson?.updatedAt
            ? new Date(selectedLesson.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : ""}
        </Typography>
        <Typography variant="body1" paragraph mb={0}>
          {selectedLesson?.desc}
        </Typography>
      </Box>
      {handleOpenNote && (
        <Button variant="contained" color="primary" onClick={handleOpenNote}>
          Add note
        </Button>
      )}
    </Box>
  );
};

export default LessonInfo;
