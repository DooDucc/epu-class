import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaletteMode } from "@mui/material";

interface ThemeState {
  mode: PaletteMode;
}

const initialState: ThemeState = {
  mode: (localStorage.getItem("themeMode") as PaletteMode) || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", state.mode);
    },
    setTheme: (state, action: PayloadAction<PaletteMode>) => {
      state.mode = action.payload;
      localStorage.setItem("themeMode", action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
