import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  appPaths,
  COMPONENT_STAGES,
  EmptyResult,
  Loading,
  useAppDispatch,
  useAppSelector,
} from "../../base";
import { getClass } from "../redux/actions";
import { setClass } from "../redux/slice";
import { CourseCard } from "../components";
import { Student } from "../types";

const ClassDetails = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    class: { updatingClass, courses, state },
  } = useAppSelector((state) => state.class);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getClass({ id, isStudent: true }));
    }
    return () => {
      dispatch(setClass({ data: [] }));
    };
  }, [id, dispatch]);

  const handleClickCourse = (courseId: string) => {
    if (user) {
      const isRegisterCourse = courses
        .find((course) => course.id === courseId)
        ?.students.some((student: Student) => student.id === user.id);
      const path = isRegisterCourse
        ? `${appPaths.STUDENT_COURSE}/${courseId}`
        : `${appPaths.STUDENT_COURSE}/${courseId}/review`;
      navigate(path);
    }
  };

  if (state === COMPONENT_STAGES.LOADING) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 2, flex: 1 }}>
      <Typography variant="h4" color="primary" mb={2}>
        All subjects in {updatingClass?.className || "Class Details"}
      </Typography>
      {courses.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              handleClickCourse={handleClickCourse}
            />
          ))}
        </Box>
      ) : (
        <EmptyResult message="No subjects found for this class." height={200} />
      )}
    </Box>
  );
};

export default ClassDetails;
