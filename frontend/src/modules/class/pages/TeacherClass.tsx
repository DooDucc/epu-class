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
import { Actions, ClassTable } from "../components";
import DeleteConfirmationDialog from "../components/Teacher/DeleteConfirmationDialog";
import { deleteClass, getClasses, updateClass } from "../redux/actions";

const TeacherClass = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    class: { data: classes, state, currentPage, totalPages, searchTerm },
  } = useAppSelector((state) => state.class);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  const fetchClasses = useCallback(
    (search: string, page: number, isLoading = false) => {
      dispatch(getClasses({ search, page, limit: 5, isLoading }));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchClasses("", 1, true);
  }, []);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    fetchClasses(searchTerm, value, true);
  };

  const handleStatusChange = (classId: string, newStatus: boolean) => {
    dispatch(
      updateClass({
        id: classId,
        isPublished: newStatus,
        handleSuccess: () => {
          toast.success("Class status updated successfully");
          fetchClasses(searchTerm, currentPage);
        },
        handleFail: () => {
          toast.error("Failed to update class status");
        },
      })
    );
  };

  const handleEdit = (classId: string) => {
    navigate(`${appPaths.TEACHER_CLASS}/${classId}`);
  };

  const handleDeleteClick = (classId: string) => {
    setClassToDelete(classId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (classToDelete) {
      dispatch(
        deleteClass({
          id: classToDelete,
          handleSuccess: () => {
            toast.success("Class deleted successfully");
            fetchClasses(searchTerm, currentPage);
          },
          handleFail: () => {
            toast.error("Failed to delete class");
          },
        })
      );
    }
    setDeleteModalOpen(false);
    setClassToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setClassToDelete(null);
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
      {classes.length === 0 ? (
        <EmptyResult />
      ) : (
        <>
          <ClassTable
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

export default TeacherClass;
