import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { Sidebar } from "../../base";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      {children}
    </Box>
  );
};

export default MainLayout;
