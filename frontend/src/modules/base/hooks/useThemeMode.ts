import { useState, useEffect } from "react";
import { PaletteMode } from "@mui/material";

export const useThemeMode = () => {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode") as PaletteMode;
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  return { mode, toggleTheme };
};
