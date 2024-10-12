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
import { Actions, DeleteConfirmationDialog, LessonTable } from "../components";
import { deleteLesson, getLessons, updateLesson } from "../redux/actions";

const TeacherLesson = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    lesson: { data: lessons, state, currentPage, totalPages, searchTerm },
  } = useAppSelector((state) => state.lesson);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

  const fetchLessons = useCallback(
    (search: string, page: number = 1, isLoading = false) => {
      dispatch(getLessons({ search, page, limit: 5, isLoading }));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchLessons(searchTerm, 1, true);
  }, [fetchLessons]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    fetchLessons(searchTerm, value, true);
  };

  const handleStatusChange = (lessonId: string, newStatus: boolean) => {
    dispatch(
      updateLesson({
        id: lessonId,
        isPublished: newStatus,
        handleSuccess: () => {
          toast.success("Lesson status updated successfully");
          fetchLessons(searchTerm, currentPage);
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
            fetchLessons(searchTerm, currentPage);
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
        p: 3,
      }}
    >
      <Actions />
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
