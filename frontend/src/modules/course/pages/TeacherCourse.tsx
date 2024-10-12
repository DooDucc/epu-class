import { Box, Pagination } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  EmptyResult,
  Error,
  Loading,
  useAppDispatch,
  useAppSelector,
} from "../../base";
import { appPaths } from "../../base/routes";
import { COMPONENT_STAGES } from "../../base/utils/constants";
import { Actions } from "../components";
import CourseTable from "../components/CourseTable";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import { deleteCourse, getCourses, updateCourse } from "../redux/actions";

const TeacherCourse = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    course: { data: courses, state, currentPage, totalPages, searchTerm },
  } = useAppSelector((state) => state.course);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const fetchCourses = useCallback(
    (search: string, page: number, isLoading = false) => {
      dispatch(getCourses({ search, page, limit: 5, isLoading }));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchCourses("", 1, true);
  }, [fetchCourses]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    fetchCourses(searchTerm, value, true);
  };

  const handleStatusChange = (courseId: string, newStatus: boolean) => {
    dispatch(
      updateCourse({
        id: courseId,
        isPublished: newStatus,
        handleSuccess: () => {
          toast.success("Course status updated successfully");
          fetchCourses(searchTerm, currentPage);
        },
        handleFail: () => {
          toast.error("Failed to update course status");
        },
      })
    );
  };

  const handleEdit = (courseId: string) => {
    navigate(`${appPaths.TEACHER_SUBJECT}/${courseId}`);
  };

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      dispatch(
        deleteCourse({
          id: courseToDelete,
          handleSuccess: () => {
            toast.success("Course deleted successfully");
            fetchCourses(searchTerm, currentPage);
          },
          handleFail: () => {
            toast.error("Failed to delete course");
          },
        })
      );
    }
    setDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  if (state === COMPONENT_STAGES.LOADING) {
    return <Loading />;
  }

  if (state === COMPONENT_STAGES.FAIL) {
    return <Error />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        padding: 3,
      }}
    >
      <Actions />
      {courses.length === 0 ? (
        <EmptyResult />
      ) : (
        <>
          <CourseTable
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
          {totalPages > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
      <DeleteConfirmationDialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default TeacherCourse;
