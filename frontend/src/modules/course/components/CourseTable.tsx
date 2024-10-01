import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Avatar,
  IconButton,
  Box,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppSelector } from "../../base";

interface CourseTableProps {
  onStatusChange: (courseId: string, newStatus: boolean) => void;
  onEdit: (courseId: string) => void;
  onDelete: (courseId: string) => void;
}

type Order = "asc" | "desc";

const CourseTable: React.FC<CourseTableProps> = ({
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const {
    course: { data: courses },
  } = useAppSelector((state) => state.course);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof (typeof courses)[0]>("title");
  const [sortedCourses, setSortedCourses] = useState(courses);

  useEffect(() => {
    const sorted = [...courses].sort((a, b) => {
      const isAsc = order === "asc";
      if (orderBy === "isPublished") {
        return (
          (a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1) *
          (isAsc ? 1 : -1)
        );
      } else {
        return (a[orderBy] < b[orderBy] ? -1 : 1) * (isAsc ? 1 : -1);
      }
    });
    setSortedCourses(sorted);
  }, [courses, order, orderBy]);

  const handleRequestSort = (property: keyof (typeof courses)[0]) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleLocalStatusChange = (courseId: string, newStatus: boolean) => {
    const updatedCourses = sortedCourses.map((course) =>
      course.id === courseId ? { ...course, isPublished: newStatus } : course
    );
    setSortedCourses(updatedCourses);
    onStatusChange(courseId, newStatus);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} aria-label="course table">
        <TableHead>
          <TableRow>
            <TableCell>Course ID</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "classCode"}
                direction={orderBy === "classCode" ? order : "asc"}
                onClick={() => handleRequestSort("classCode")}
              >
                Class Code
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "title"}
                direction={orderBy === "title" ? order : "asc"}
                onClick={() => handleRequestSort("title")}
              >
                Title
              </TableSortLabel>
            </TableCell>
            <TableCell>Description</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "isPublished"}
                direction={orderBy === "isPublished" ? order : "asc"}
                onClick={() => handleRequestSort("isPublished")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "createdAt"}
                direction={orderBy === "createdAt" ? order : "asc"}
                onClick={() => handleRequestSort("createdAt")}
              >
                Created At
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCourses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.id}</TableCell>
              <TableCell>{course.class.classCode}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={course.imageUrl}
                    alt={course.id}
                    sx={{ width: 40, height: 40, marginRight: 1 }}
                    variant="rounded"
                  />
                  {course.title}
                </Box>
              </TableCell>
              <TableCell>{course.desc}</TableCell>
              <TableCell>
                <Switch
                  checked={course.isPublished}
                  onChange={(e) =>
                    handleLocalStatusChange(course.id, e.target.checked)
                  }
                  color="primary"
                />
              </TableCell>
              <TableCell>
                {new Date(course.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(course.id)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(course.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseTable;
