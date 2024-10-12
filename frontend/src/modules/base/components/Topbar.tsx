import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appPaths, useAppDispatch, useAppSelector } from "..";
import { logout } from "../../auth";
import { toggleTheme } from "../redux/themeSlice";

const Topbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const mode = useAppSelector((state) => state.theme.mode);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate(appPaths.PROFILE);
    handleClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate(appPaths.SIGN_IN);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexGrow: 1,
          p: 3,
          width: "100%",
          height: 70,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
            gap: 4,
          }}
        >
          <IconButton
            onClick={handleToggleTheme}
            color="inherit"
            size="small"
            sx={{
              width: 40,
              height: 40,
            }}
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleClick}
          >
            <Avatar
              alt={user?.fullName || "User"}
              src={user?.avatar}
              sx={{ width: 40, height: 40 }}
            />
            <Box
              sx={{
                ml: 1,
                maxWidth: 100,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.fullName || "User"}
            </Box>
          </Box>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          style: {
            minWidth: "200px",
            marginLeft: "8px",
          },
        }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Divider />
    </>
  );
};

export default Topbar;
