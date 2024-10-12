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
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppSelector } from "../../../base";

interface ClassTableProps {
  onStatusChange: (classId: string, newStatus: boolean) => void;
  onEdit: (classId: string) => void;
  onDelete: (classId: string) => void;
}

type Order = "asc" | "desc";

const ClassTable: React.FC<ClassTableProps> = ({
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const {
    class: { data: classes },
  } = useAppSelector((state) => state.class);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] =
    useState<keyof (typeof classes)[0]>("classCode");
  const [sortedClasses, setSortedClasses] = useState(classes);

  useEffect(() => {
    const sorted = [...classes].sort((a, b) => {
      const isAsc = order === "asc";
      if (orderBy === "major") {
        return (a.major.name < b.major.name ? -1 : 1) * (isAsc ? 1 : -1);
      } else if (orderBy === "isPublished") {
        return (
          (a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1) *
          (isAsc ? 1 : -1)
        );
      } else {
        return (a[orderBy] < b[orderBy] ? -1 : 1) * (isAsc ? 1 : -1);
      }
    });
    setSortedClasses(sorted);
  }, [classes, order, orderBy]);

  const handleRequestSort = (property: keyof (typeof classes)[0]) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleLocalStatusChange = (classId: string, newStatus: boolean) => {
    const updatedClasses = sortedClasses.map((cls) =>
      cls.id === classId ? { ...cls, isPublished: newStatus } : cls
    );
    setSortedClasses(updatedClasses);
    onStatusChange(classId, newStatus);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} aria-label="class table">
        <TableHead>
          <TableRow>
            <TableCell>Class ID</TableCell>
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
                active={orderBy === "className"}
                direction={orderBy === "className" ? order : "asc"}
                onClick={() => handleRequestSort("className")}
              >
                Class Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "major"}
                direction={orderBy === "major" ? order : "asc"}
                onClick={() => handleRequestSort("major")}
              >
                Major
              </TableSortLabel>
            </TableCell>
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
          {sortedClasses.map((classItem) => (
            <TableRow key={classItem.id}>
              <TableCell>
                <Tooltip title={classItem.id}>
                  <span>{classItem.id.slice(0, 8)}...</span>
                </Tooltip>
              </TableCell>
              <TableCell>{classItem.classCode}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={classItem.thumbnail}
                    alt={classItem.className}
                    sx={{ width: 40, height: 40, marginRight: 1 }}
                    variant="rounded"
                  />
                  {classItem.className}
                </Box>
              </TableCell>
              <TableCell>{classItem.major.name}</TableCell>
              <TableCell>
                <Switch
                  checked={classItem.isPublished}
                  onChange={(e) =>
                    handleLocalStatusChange(classItem.id, e.target.checked)
                  }
                  color="primary"
                />
              </TableCell>
              <TableCell>
                {new Date(classItem.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => onEdit(classItem.id)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(classItem.id)}
                  color="error"
                >
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

export default ClassTable;
