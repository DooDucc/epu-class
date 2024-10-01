import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { Student } from "../types";

interface StudentTableProps {
  students: Student[];
  onViewDetails: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onViewDetails,
  onDelete,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="student table">
        <TableHead>
          <TableRow>
            <TableCell width="120px">Student Code</TableCell>
            <TableCell width="80px">Avatar</TableCell>
            <TableCell width="150px">Full Name</TableCell>
            <TableCell width="150px">Phone</TableCell>
            <TableCell>Classes</TableCell>
            <TableCell width="150px">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell width="120px">{student.studentCode}</TableCell>
              <TableCell width="80px">
                <Avatar
                  src={student.user.avatar || undefined}
                  alt={student.user.fullName}
                />
              </TableCell>
              <TableCell width="150px">{student.user.fullName}</TableCell>
              <TableCell width="150px">{student.user.phone || "N/A"}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {student.classes.map((cls) => (
                    <Chip
                      key={cls.classCode}
                      label={`${cls.classCode} - ${cls.className}`}
                      size="small"
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell width="150px">
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => onViewDetails(student)}
                  >
                    Detail
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(student.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
