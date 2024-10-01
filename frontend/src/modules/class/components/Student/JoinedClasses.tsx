import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../../../base";
import { Class } from "../../types";

interface JoinedClassesProps {
  classes: Class[];
}

const JoinedClasses = ({ classes }: JoinedClassesProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {classes.map((classItem) => (
        <Card
          key={classItem.id}
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
          onClick={() => navigate(`${appPaths.STUDENT_CLASS}/${classItem.id}`)}
        >
          <CardMedia
            component="img"
            height="150"
            image={classItem.thumbnail || "https://via.placeholder.com/300x150"}
            alt={classItem.className}
          />
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              color="primary"
              gutterBottom
            >
              {classItem.className}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.primary">
                👤 {classItem?.teacher?.fullName}
              </Typography>
              <Typography variant="body2" color="text.primary">
                👥 {classItem.students.length} students
              </Typography>
              <Typography variant="body2" color="text.primary">
                📚 {classItem.courses.length} subjects
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default JoinedClasses;
