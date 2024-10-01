import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Pagination, TextField, Typography } from "@mui/material";
import debounce from "lodash/debounce";
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
import { ClassTable } from "../components";
import DeleteConfirmationDialog from "../components/Teacher/DeleteConfirmationDialog";
import { getClasses, updateClass } from "../redux/actions";

const TeacherClass = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    class: { data: classes, state, currentPage, totalPages },
  } = useAppSelector((state) => state.class);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  const fetchClasses = useCallback(
    (search: string, page: number) => {
      dispatch(getClasses({ search, page, limit: 5 }));
    },
    [dispatch]
  );

  const debouncedFetchClasses = useCallback(
    debounce((search: string, page: number) => fetchClasses(search, page), 300),
    [fetchClasses]
  );

  useEffect(() => {
    fetchClasses(searchTerm, page);
  }, [fetchClasses, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setPage(1);
    debouncedFetchClasses(newSearchTerm, 1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddClass = () => {
    navigate(appPaths.TEACHER_CLASS_CREATE);
  };

  const handleStatusChange = (classId: string, newStatus: boolean) => {
    dispatch(
      updateClass({
        id: classId,
        isPublished: newStatus,
        handleSuccess: () => {
          toast.success("Class status updated successfully");
          fetchClasses(searchTerm, page);
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
      // TODO: Implement actual delete logic
      console.log(`Delete class ${classToDelete}`);
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
          <Typography variant="h5">Teacher Classes</Typography>
          <TextField
            variant="outlined"
            label="Search by id, class code or name"
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
          onClick={handleAddClass}
        >
          Add Class
        </Button>
      </Box>
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
