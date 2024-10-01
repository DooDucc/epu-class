import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { Class, ClassState, Major } from "../types";

const initialState: ClassState = {
  class: {
    data: [],
    updatingClass: null,
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
    courses: [],
  },
  createClass: {
    majors: [],
    thumbnail: "",
    uploadState: "",
  },
};

export const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setClass: (
      state,
      action: PayloadAction<{
        data?: Class[];
        updatingClass?: Class | null;
        state?: string;
        currentPage?: number;
        totalPages?: number;
        courses?: any[];
      }>
    ) => {
      state.class = {
        ...state.class,
        ...action.payload,
      };
    },
    setCreateClass: (
      state,
      action: PayloadAction<{
        majors?: Major[];
        thumbnail?: string;
        uploadState?: string;
      }>
    ) => {
      state.createClass = {
        ...state.createClass,
        ...action.payload,
      };
    },
  },
});

export const { setClass, setCreateClass } = classSlice.actions;

export default classSlice.reducer;
