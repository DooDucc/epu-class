import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  EmptyResult,
  Error,
  Loading,
  useAppDispatch,
  useAppSelector,
} from "../../base";
import { deleteCourse, getCourses, updateCourse } from "../redux/actions";
import { appPaths } from "../../base/routes";
import { Typography, Box, Button, TextField, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { COMPONENT_STAGES } from "../../base/utils/constants";
import CourseTable from "../components/CourseTable";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";

const TeacherCourse = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    course: { data: courses, state, currentPage, totalPages },
  } = useAppSelector((state) => state.course);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const fetchCourses = useCallback(
    (search: string, page: number) => {
      dispatch(getCourses({ search, page, limit: 5 }));
    },
    [dispatch]
  );

  const debouncedFetchCourses = useCallback(
    debounce((search: string, page: number) => fetchCourses(search, page), 300),
    [fetchCourses]
  );

  useEffect(() => {
    fetchCourses(searchTerm, page);
  }, [fetchCourses, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setPage(1);
    debouncedFetchCourses(newSearchTerm, 1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddCourse = () => {
    navigate(appPaths.TEACHER_SUBJECT_CREATE);
  };

  const handleStatusChange = (courseId: string, newStatus: boolean) => {
    dispatch(
      updateCourse({
        id: courseId,
        isPublished: newStatus,
        handleSuccess: () => {
          toast.success("Course status updated successfully");
          fetchCourses(searchTerm, page);
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
            fetchCourses(searchTerm, page);
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
        mt: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
        >
          <Typography variant="h5">Teacher Subjects</Typography>
          <TextField
            variant="outlined"
            label="Search by id, title or class code"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ width: "300px" }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddCourse}
        >
          Add Subject
        </Button>
      </Box>
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
