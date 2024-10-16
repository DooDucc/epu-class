import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { ClassSidebar, StudentLessons } from "../components";
import { getStudentLessons } from "../redux/actions";
import { StudentLessonType } from "../types";

const StudentLesson = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const [selectedStudentLessons, setSelectedStudentLessons] = useState<
    StudentLessonType[]
  >([]);

  useEffect(() => {
    dispatch(getStudentLessons({ studentId: user?.id as string }));
  }, [user?.id, dispatch]);

  const handleSelectedStudentLessons = (
    lessons: StudentLessonType[],
    classId: string
  ) => {
    setSelectedStudentLessons(lessons);
    navigate(`${appPaths.STUDENT_LESSON}/${classId}`);
  };

  return (
    <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <ClassSidebar
        handleSelectedStudentLessons={handleSelectedStudentLessons}
      />
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {selectedStudentLessons?.length > 0 ? (
          <StudentLessons selectedStudentLessons={selectedStudentLessons} />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <Typography variant="body1">Select a course to start</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StudentLesson;
