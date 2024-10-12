import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../..";
import { ROLE } from "../../../auth/utils";
import { appPaths } from "../../routes";
import { STUDENT_SIDEBAR, TEACHER_SIDEBAR } from "./sidebarItems";

const drawerWidth = 180;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);

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
            height: 70,
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
