import React, { useState, useEffect, useCallback } from "react";
import {
  EmptyResult,
  Error,
  Loading,
  useAppDispatch,
  useAppSelector,
  DeleteConfirmationDialog,
  appPaths,
} from "../../base";
import { deleteStudentFromClass, getStudents } from "../redux/actions";
import { Typography, Box, TextField, Pagination } from "@mui/material";
import { COMPONENT_STAGES } from "../../base/utils/constants";
import StudentTable from "./StudentTable";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Student } from "../types";

const StudentWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    student: { data: studentsData, state, currentPage, totalPages },
  } = useAppSelector((state) => state.student);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const fetchStudents = useCallback(
    (search: string, page: number) => {
      dispatch(getStudents({ search, page, limit: 10 }));
    },
    [dispatch]
  );

  const debouncedFetchStudents = useCallback(
    debounce(
      (search: string, page: number) => fetchStudents(search, page),
      300
    ),
    [fetchStudents]
  );

  useEffect(() => {
    fetchStudents(searchTerm, page);
  }, [fetchStudents, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setPage(1);
    debouncedFetchStudents(newSearchTerm, 1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewDetails = (student: Student) => {
    navigate(`${appPaths.TEACHER_STUDENT}/${student.id}`);
  };

  const handleDeleteClick = (studentId: string) => {
    setStudentToDelete(studentId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      dispatch(
        deleteStudentFromClass({
          studentId: studentToDelete,
          handleSuccess: () => {
            toast.success("Student deleted successfully");
            fetchStudents(searchTerm, page);
          },
          handleError: () => {
            toast.error("Failed to delete student");
          },
        })
      );
    }
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  if (state === COMPONENT_STAGES.LOADING) {
    return <Loading />;
  }

  if (state === COMPONENT_STAGES.FAIL) {
    return <Error />;
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
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
          <Typography variant="h5">Students joined classes</Typography>
          <TextField
            variant="outlined"
            label="Search by student code or name"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ width: "300px" }}
          />
        </Box>
      </Box>
      {studentsData.length === 0 ? (
        <EmptyResult />
      ) : (
        <>
          <StudentTable
            students={studentsData}
            onViewDetails={handleViewDetails}
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
        title="Delete Student"
        content="Are you sure you want to delete this student? This action cannot be undone."
      />
    </Box>
  );
};

export default StudentWrapper;
