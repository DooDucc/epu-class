import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
