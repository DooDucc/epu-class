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
  IconButton,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppSelector } from "../../../base";

interface LessonTableProps {
  onStatusChange: (lessonId: string, newStatus: boolean) => void;
  onEdit: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
}

type Order = "asc" | "desc";

const LessonTable: React.FC<LessonTableProps> = ({
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const {
    lesson: { data: lessons },
  } = useAppSelector((state) => state.lesson);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof (typeof lessons)[0]>("title");
  const [sortedLessons, setSortedLessons] = useState(lessons);

  useEffect(() => {
    const sorted = [...lessons].sort((a, b) => {
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
    setSortedLessons(sorted);
  }, [lessons, order, orderBy]);

  const handleRequestSort = (property: keyof (typeof lessons)[0]) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleLocalStatusChange = (lessonId: string, newStatus: boolean) => {
    const updatedLessons = sortedLessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, isPublished: newStatus } : lesson
    );
    setSortedLessons(updatedLessons);
    onStatusChange(lessonId, newStatus);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} aria-label="lesson table">
        <TableHead>
          <TableRow>
            <TableCell>Lesson ID</TableCell>
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
          {sortedLessons.map((lesson) => (
            <TableRow key={lesson.id}>
              <TableCell>{lesson.id}</TableCell>
              <TableCell>{lesson.title}</TableCell>
              <TableCell>{lesson.desc}</TableCell>
              <TableCell>
                <Switch
                  checked={lesson.isPublished}
                  onChange={(e) =>
                    handleLocalStatusChange(lesson.id, e.target.checked)
                  }
                  color="primary"
                />
              </TableCell>
              <TableCell>
                {new Date(lesson.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(lesson.id)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(lesson.id)} color="error">
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

export default LessonTable;
