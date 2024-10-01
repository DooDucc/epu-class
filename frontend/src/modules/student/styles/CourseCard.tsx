import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { StudentDetailCourse } from "../types";

export const CourseCard: React.FC<{
  course: StudentDetailCourse;
  isSelected: boolean;
  onClick: () => void;
}> = ({ course, isSelected, onClick }) => (
  <Card
    sx={{
      width: 200,
      m: 1,
      border: isSelected ? "2px solid #1976d2" : "none",
    }}
  >
    <CardActionArea onClick={onClick}>
      <CardMedia
        component="img"
        height="140"
        image={
          course.imageUrl || "https://via.placeholder.com/140x140?text=No+Image"
        }
        alt={course.title}
      />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {course.desc}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);
