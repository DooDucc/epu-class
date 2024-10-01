import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { StudentLessonType } from "../../types";

interface StudentLessonsProps {
  selectedStudentLessons: StudentLessonType[];
}

const StudentLessons = ({ selectedStudentLessons }: StudentLessonsProps) => {
  return (
    <Box sx={{ padding: 2, pl: "320px" }}>
      <Grid container spacing={2}>
        {selectedStudentLessons.map((lesson, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6">{lesson.title}</Typography>
                  <Chip label="Completed" color="success" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {lesson.desc}
                </Typography>
                <Box mb={2}>
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
                </Box>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  fullWidth
                  color="primary"
                >
                  Watch Video
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentLessons;
