/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { formatDuration } from "../../utils";

interface CourseCardProps {
  course: any;
  handleClickCourse: (courseId: string) => void;
}

const CourseCard = ({ course, handleClickCourse }: CourseCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        flexBasis: "calc(33.333% - 16px)",
        minWidth: 250,
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => handleClickCourse(course.id)}
    >
      <CardMedia
        component="img"
        height="150"
        image={course.imageUrl || "https://via.placeholder.com/300x150"}
        alt={course.title}
      />
      <CardContent>
        <Typography variant="h6" component="div" color="primary" gutterBottom>
          {course.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {course.desc}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Typography variant="body2" color="text.primary">
            👤 {course.teacher?.user?.fullName}
          </Typography>
          <Typography variant="body2" color="text.primary">
            📚{" "}
            {course.lessons?.filter((lesson: any) => lesson.isPublished)
              ?.length || 0}{" "}
            lessons
          </Typography>
          <Typography variant="body2" color="text.primary">
            🕒{" "}
            {formatDuration(
              course.lessons
                ?.filter((lesson: any) => lesson.isPublished)
                ?.reduce(
                  (acc: number, lesson: any) =>
                    acc + (lesson.videoDuration || 0),
                  0
                ) || 0
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
