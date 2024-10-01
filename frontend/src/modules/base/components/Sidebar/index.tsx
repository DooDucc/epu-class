import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { STUDENT_SIDEBAR, TEACHER_SIDEBAR } from "./sidebarItems";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../../routes";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { toggleTheme } from "../../redux/themeSlice";
import { useState } from "react";
import { logout } from "../../../auth/redux/slice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { ROLE } from "../../../auth/utils";
import { useLocation } from "react-router-dom";

const drawerWidth = 180;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const { user } = useSelector((state: RootState) => state.auth);

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

  const RENDER_SIDEBAR =
    user?.role === ROLE.TEACHER ? TEACHER_SIDEBAR : STUDENT_SIDEBAR;

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          <Box
            sx={{
              width: 130,
              cursor: "pointer",
            }}
          >
            <img
              src="https://itc.epu.edu.vn/ContentV2/images/logoepu.svg"
              alt="logo"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "12px",
              }}
              onClick={() => navigate(appPaths.ROOT)}
            />
          </Box>
        </Box>
        <Divider />
        <List>
          {RENDER_SIDEBAR.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.link)}
                selected={location.pathname.includes(item.link)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname.includes(item.link)
                      ? "primary.contrastText"
                      : "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ marginTop: "auto" }}>
        <Divider />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
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
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
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
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
