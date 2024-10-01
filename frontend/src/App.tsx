import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./modules/base/redux/store";
import { routes } from "./modules/base";

const App = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} element={route.element}>
              {route.children &&
                route.children.map((childRoute, childIndex) => (
                  <Route
                    key={childIndex}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
            </Route>
          ))}
        </Routes>
      </BrowserRouter>
      <ToastContainer limit={1} />
    </ThemeProvider>
  );
};

export default App;
