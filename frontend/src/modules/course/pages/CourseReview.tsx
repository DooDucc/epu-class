import {
  AccessTime,
  LocationOn,
  PlayCircleOutline,
  School,
  VideoLibrary,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { getCourse, registerCourse } from "../redux/actions";
import { setCourse } from "../redux/slice";
import ClassCodeModal from "../components/ClassCodeModal";
import { joinClass } from "../../class/redux/actions";

const CourseReview = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    course: { updatingCourse },
  } = useAppSelector((state) => state.course);
  const { user } = useAppSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getCourse({ id }));
    }

    return () => {
      dispatch(setCourse({ data: [] }));
    };
  }, [id, dispatch]);

  if (!updatingCourse) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const formatDuration = (totalSeconds: number): string => {
    if (totalSeconds < 60) {
      return `${totalSeconds} second${totalSeconds !== 1 ? "s" : ""}`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes} minute${minutes !== 1 ? "s" : ""}${
        seconds > 0 ? ` ${seconds} second${seconds !== 1 ? "s" : ""}` : ""
      }`;
    } else {
      const hours = Math.floor(totalSeconds / 3600);
      const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""}${
        remainingMinutes > 0
          ? ` ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`
          : ""
      }`;
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleRegister = (classCode: string) => {
    dispatch(
      joinClass({
        classCode,
        userId: user?.id || "",
        handleSuccess: () => {
          navigate(`${appPaths.STUDENT_CLASS}/${id}`);
          toast.success("Joined class successfully");
        },
        handleFail: (errorMessage) => {
          toast.error(errorMessage);
        },
      })
    );
    handleModalClose();
  };

  return (
    <Box sx={{ p: 3, flex: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {updatingCourse.className}
            </Typography>
            <Typography variant="body1">{updatingCourse.desc}</Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Class Content
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>
                {
                  updatingCourse?.lessons?.filter(
                    (lesson) => lesson.isPublished
                  )?.length
                }{" "}
                lessons
              </Typography>
              <Typography>-</Typography>
              <Typography>
                Duration{" "}
                {formatDuration(
                  updatingCourse?.lessons
                    ?.filter((lesson) => lesson.isPublished)
                    ?.reduce(
                      (acc: number, lesson) =>
                        acc + (lesson.videoDuration || 0),
                      0
                    ) || 0
                )}
              </Typography>
            </Box>
            <List>
              {updatingCourse?.lessons
                .filter((lesson) => lesson.isPublished)
                .map((lesson, lessonIndex: number) => (
                  <ListItem key={lessonIndex} divider>
                    <ListItemIcon>
                      <PlayCircleOutline />
                    </ListItemIcon>
                    <ListItemText
                      primary={lesson.title}
                      secondary={lesson.desc}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2" color="textSecondary">
                        {formatDuration(lesson.videoDuration)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {updatingCourse?.imageUrl && (
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={updatingCourse?.imageUrl}
                  alt={updatingCourse?.title}
                  variant="rounded"
                  sx={{ width: "100%", height: 200, objectFit: "cover" }}
                />
              </Box>
            )}
            <List>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary="Basic level" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <VideoLibrary />
                </ListItemIcon>
                <ListItemText
                  primary={`Total ${
                    updatingCourse?.lessons?.filter(
                      (lesson) => lesson.isPublished
                    )?.length
                  } lessons`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTime />
                </ListItemIcon>
                <ListItemText
                  primary={`Duration ${formatDuration(
                    updatingCourse?.lessons
                      ?.filter((lesson) => lesson.isPublished)
                      ?.reduce(
                        (acc: number, lesson) =>
                          acc + (lesson.videoDuration || 0),
                        0
                      ) || 0
                  )}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary="Learn anytime, anywhere" />
              </ListItem>
            </List>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => setModalOpen(true)}
            >
              Register to learn
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <ClassCodeModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleRegister}
        className={updatingCourse?.className || ""}
      />
    </Box>
  );
};

export default CourseReview;
