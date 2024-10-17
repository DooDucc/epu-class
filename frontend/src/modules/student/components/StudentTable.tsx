import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography,
  LinearProgress,
} from "@mui/material";
import React from "react";
import { Student } from "../types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  const [openSelect, setOpenSelect] = React.useState<string | null>(null);

  const handleSelectOpen = (studentId: string) => {
    setOpenSelect(studentId);
  };

  const handleSelectClose = () => {
    setOpenSelect(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="student table">
        <TableHead>
          <TableRow>
            <TableCell width="120px">Student Code</TableCell>
            <TableCell width="150px">Name</TableCell>
            <TableCell width="150px">Phone</TableCell>
            <TableCell width="150px">Classes</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell width="150px">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => {
            const totalLessons = student.classes.reduce((total, cls) => {
              return total + cls.lessons.length;
            }, 0);
            const completedLessons = student.classes.reduce((total, cls) => {
              return (
                total +
                cls.lessons.filter((lesson) =>
                  lesson.userProgress.some(
                    (progress) =>
                      progress.studentId === student.id && progress.isCompleted
                  )
                ).length
              );
            }, 0);

            const progressPercentage =
              totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

            return (
              <TableRow key={student.id}>
                <TableCell width="120px">{student.studentCode}</TableCell>
                <TableCell width="150px">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={student.user.avatar || undefined}
                      alt={student.user.fullName}
                      sx={{ width: 40, height: 40, marginRight: 1 }}
                      variant="circular"
                    />
                    {student.user.fullName}
                  </Box>
                </TableCell>
                <TableCell width="150px">
                  {student.user.phone || "N/A"}
                </TableCell>
                <TableCell>
                  <Select
                    value=""
                    open={openSelect === student.id}
                    onOpen={() => handleSelectOpen(student.id)}
                    onClose={handleSelectClose}
                    onChange={() => {}}
                    displayEmpty
                    renderValue={() => `Classes (${student.classes.length})`}
                    IconComponent={ExpandMoreIcon}
                    sx={{ width: 150 }}
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                        },
                      },
                    }}
                  >
                    {student.classes.map((cls) => (
                      <MenuItem
                        key={cls.classCode}
                        value={cls.classCode}
                        onClick={() => {}}
                      >
                        {cls.className}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{
                        flexGrow: 1,
                        height: 10, // Increase the height
                        borderRadius: 5, // Optional: round the corners
                      }}
                    />
                    <Typography variant="body2">
                      {completedLessons} / {totalLessons} lessons
                    </Typography>
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
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
