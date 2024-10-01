import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../base";
import { getStudent } from "../redux/actions";
import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import { COMPONENT_STAGES } from "../../base/utils/constants";
import { StudentDetailClass, StudentDetailCourse } from "../types/sliceTypes";
import { ClassCard, CourseCard, LessonCard } from "../styles";

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [selectedClass, setSelectedClass] = useState<StudentDetailClass | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] =
    useState<StudentDetailCourse | null>(null);

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

  const { user, studentCode, classes, courses } = currentStudent;

  const handleClassClick = (cls: StudentDetailClass) => {
    setSelectedClass(cls);
    setSelectedCourse(null); // Reset selected course when changing class
  };

  const handleCourseClick = (course: StudentDetailCourse) => {
    setSelectedCourse(course);
  };

  const filteredCourses = selectedClass
    ? courses.filter((course) => course.classId === selectedClass.id)
    : [];

  return (
    <Box sx={{ padding: 3, width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Student Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Avatar
                src={user.avatar || undefined}
                alt={user.fullName || ""}
                sx={{ width: 200, height: 200 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                {user.fullName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Student Code: {studentCode}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phone: {user.phone || "N/A"}
              </Typography>
            </Grid>
          </Grid>

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
                Joined courses in {selectedClass.className}
              </Typography>
              {filteredCourses.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => handleCourseClick(course)}
                      isSelected={selectedCourse?.id === course.id}
                    />
                  ))}
                </Box>
              ) : (
                <Typography>No courses found for this class.</Typography>
              )}
            </Box>
          )}

          {selectedCourse && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Lessons in {selectedCourse.title}
              </Typography>
              {selectedCourse.lessons && selectedCourse.lessons.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {selectedCourse.lessons.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                  ))}
                </Box>
              ) : (
                <Typography>No lessons found for this course.</Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDetail;
