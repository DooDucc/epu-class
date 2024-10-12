import { Box, Button, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { memo, useCallback } from "react";
import { appPaths, useAppDispatch, useAppSelector } from "../../../base";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { getLessons } from "../../redux/actions";
import { setLesson } from "../../redux/slice";

const Actions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { searchTerm } = useAppSelector((state) => state.lesson.lesson);

  const debouncedFetchLessons = useCallback(
    debounce(
      (search: string, page: number) =>
        dispatch(getLessons({ search, page, limit: 5 })),
      300
    ),
    [dispatch]
  );

  const handleAddLesson = () => {
    navigate(appPaths.TEACHER_LESSON_CREATE);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    dispatch(setLesson({ searchTerm: newSearchTerm }));
    debouncedFetchLessons(newSearchTerm, 1);
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
        <Typography variant="h5">Lessons</Typography>
        <TextField
          variant="outlined"
          label="Search by id, title or subject id"
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
        onClick={handleAddLesson}
      >
        Add Lesson
      </Button>
    </Box>
  );
};

export default memo(Actions);
