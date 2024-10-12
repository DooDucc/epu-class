import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
  styled,
  Badge,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appPaths, useAppDispatch, useAppSelector } from "..";
import { logout } from "../../auth";
import { toggleTheme } from "../redux/themeSlice";

const StyledListItem = styled(ListItem)<{ unread?: boolean }>(
  ({ theme, unread }) => ({
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer",
    },
    backgroundColor: unread ? theme.palette.action.hover : "transparent",
    fontWeight: unread ? "bold" : "normal",
  })
);

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const Topbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const mode = useAppSelector((state) => state.theme.mode);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const notificationOpen = Boolean(notificationAnchorEl);

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

  const fakeNotifications = [
    { id: 1, message: "New message from John Doe", unread: true },
    { id: 2, message: "You have a new task assigned", unread: true },
    { id: 3, message: "Meeting reminder: Team sync at 2 PM", unread: false },
  ];

  const unreadCount = fakeNotifications.filter(
    (notification) => notification.unread
  ).length;

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleMarkAsRead = () => {
    // Implement the logic to mark all notifications as read
    console.log("Marked all notifications as read");
    // You would typically update your state or make an API call here
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
            color="inherit"
            size="small"
            sx={{
              width: 40,
              height: 40,
            }}
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
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
      <Popover
        open={notificationOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button onClick={handleMarkAsRead} size="small">
            Mark as read
          </Button>
        </Box>
        <List sx={{ width: "300px", maxWidth: "100%", pt: 0 }}>
          {fakeNotifications.length > 0 ? (
            fakeNotifications.map((notification) => (
              <StyledListItem
                key={notification.id}
                unread={notification.unread}
              >
                <StyledListItemText primary={notification.message} />
              </StyledListItem>
            ))
          ) : (
            <StyledListItem>
              <StyledListItemText primary="No new notifications" />
            </StyledListItem>
          )}
        </List>
      </Popover>
      <Divider />
    </>
  );
};

export default Topbar;
