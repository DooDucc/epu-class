import AddIcon from "@mui/icons-material/Add";
import { Box, Button, TextField, Typography } from "@mui/material";
import debounce from "lodash/debounce";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { appPaths, useAppDispatch, useAppSelector } from "../../base";
import { getCourses } from "../redux/actions";
import { setCourse } from "../redux/slice";

const Actions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { searchTerm } = useAppSelector((state) => state.course.course);

  const debouncedFetchCourses = useCallback(
    debounce(
      (search: string, page: number) =>
        dispatch(getCourses({ search, page, limit: 5 })),
      300
    ),
    [dispatch]
  );

  const handleAddCourse = () => {
    navigate(appPaths.TEACHER_SUBJECT_CREATE);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    dispatch(setCourse({ searchTerm: newSearchTerm }));
    debouncedFetchCourses(newSearchTerm, 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
        <Typography variant="h5">Subjects</Typography>
        <TextField
          variant="outlined"
          label="Search by id, title or class code"
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
        onClick={handleAddCourse}
      >
        Add Subject
      </Button>
    </Box>
  );
};

export default memo(Actions);
