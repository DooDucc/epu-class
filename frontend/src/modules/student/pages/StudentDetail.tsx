import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../base";
import { getStudent } from "../redux/actions";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import { COMPONENT_STAGES } from "../../base/utils/constants";
import { StudentDetailClass } from "../types/sliceTypes";
import { ClassCard, LessonCard } from "../styles";

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [selectedClass, setSelectedClass] = useState<StudentDetailClass | null>(
    null
  );

  const {
    student: { currentStudent, state },
  } = useAppSelector((state) => state.student);

  useEffect(() => {
    if (id) {
      dispatch(getStudent(id));
    }
  }, [id, dispatch]);

  if (state === COMPONENT_STAGES.LOADING) {
    return <div>Loading...</div>;
  }

  if (state === COMPONENT_STAGES.FAIL) {
    return <div>Error loading student details</div>;
  }

  if (!currentStudent) return null;

  const { user, studentCode, classes } = currentStudent;

  const handleClassClick = (cls: StudentDetailClass) => {
    setSelectedClass(cls);
  };

  return (
    <Box sx={{ padding: 3, width: "100%" }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              justifyContent: "center",
            }}
          >
            <Avatar
              src={user.avatar || undefined}
              alt={user.fullName || ""}
              sx={{ width: 120, height: 120 }}
            />
            <Box>
              <Typography variant="h5" gutterBottom>
                {user.fullName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Student Code: {studentCode}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Class: {user.class}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phone: {user.phone || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Joined Classes
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              {classes.map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  isSelected={selectedClass?.id === cls.id}
                  onClick={() => handleClassClick(cls)}
                />
              ))}
            </Box>
          </Box>

          {selectedClass && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Lessons in {selectedClass.className}
              </Typography>
              {selectedClass.lessons && selectedClass.lessons.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {selectedClass.lessons.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                  ))}
                </Box>
              ) : (
                <Typography>No lessons found for this class.</Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDetail;
