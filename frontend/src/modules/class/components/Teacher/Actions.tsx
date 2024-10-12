import { Box, Button, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { memo, useCallback } from "react";
import { appPaths, useAppDispatch, useAppSelector } from "../../../base";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { getClasses } from "../../redux/actions";
import { setClass } from "../../redux/slice";

const Actions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { searchTerm } = useAppSelector((state) => state.class.class);

  const debouncedFetchClasses = useCallback(
    debounce(
      (search: string, page: number) =>
        dispatch(getClasses({ search, page, limit: 5 })),
      300
    ),
    [dispatch]
  );

  const handleAddClass = () => {
    navigate(appPaths.TEACHER_CLASS_CREATE);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    dispatch(setClass({ searchTerm: newSearchTerm }));
    debouncedFetchClasses(newSearchTerm, 1);
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
        <Typography variant="h5">Classes</Typography>
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
  );
};

export default memo(Actions);
