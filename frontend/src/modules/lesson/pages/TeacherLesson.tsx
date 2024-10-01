import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  EmptyResult,
  Error,
  Loading,
  useAppDispatch,
  useAppSelector,
} from "../../base";
import { deleteLesson, getLessons, updateLesson } from "../redux/actions";
import { appPaths } from "../../base/routes";
import { Typography, Box, Button, TextField, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { COMPONENT_STAGES } from "../../base/utils/constants";
import { LessonTable, DeleteConfirmationDialog } from "../components";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";

const TeacherLesson = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    lesson: { data: lessons, state, currentPage, totalPages },
  } = useAppSelector((state) => state.lesson);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

  const fetchLessons = useCallback(
    (search: string, page: number) => {
      dispatch(getLessons({ search, page, limit: 5 }));
    },
    [dispatch]
  );

  const debouncedFetchLessons = useCallback(
    (search: string, page: number) => {
      const debouncedFn = debounce(
        (s: string, p: number) => fetchLessons(s, p),
        300
      );
      debouncedFn(search, page);
    },
    [fetchLessons]
  );

  useEffect(() => {
    fetchLessons(searchTerm, page);
  }, [fetchLessons, page, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setPage(1);
    debouncedFetchLessons(newSearchTerm, 1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddLesson = () => {
    navigate(appPaths.TEACHER_LESSON_CREATE);
  };

  const handleStatusChange = (lessonId: string, newStatus: boolean) => {
    dispatch(
      updateLesson({
        id: lessonId,
        isPublished: newStatus,
        handleSuccess: () => {
          toast.success("Lesson status updated successfully");
          fetchLessons(searchTerm, page);
        },
        handleFail: () => {
          toast.error("Failed to update lesson status");
        },
      })
    );
  };

  const handleEdit = (lessonId: string) => {
    navigate(`${appPaths.TEACHER_LESSON}/${lessonId}`);
  };

  const handleDeleteClick = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (lessonToDelete) {
      dispatch(
        deleteLesson({
          id: lessonToDelete,
          handleSuccess: () => {
            toast.success("Lesson deleted successfully");
            fetchLessons(searchTerm, page);
          },
          handleFail: () => {
            toast.error("Failed to delete lesson");
          },
        })
      );
    }
    setDeleteModalOpen(false);
    setLessonToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setLessonToDelete(null);
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
          <Typography variant="h5">Teacher Lessons</Typography>
          <TextField
            variant="outlined"
            label="Search by id, title or subject id"
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
          onClick={handleAddLesson}
        >
          Add Lesson
        </Button>
      </Box>
      {lessons.length === 0 ? (
        <EmptyResult />
      ) : (
        <>
          <LessonTable
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

export default TeacherLesson;
