import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { Class, ClassState } from "../types";

const initialState: ClassState = {
  class: {
    data: [],
    updatingClass: null,
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
    searchTerm: "",
  },
  createClass: {
    lessons: [],
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
        updatingClass?: any | null;
        state?: string;
        currentPage?: number;
        totalPages?: number;
        searchTerm?: string;
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
        thumbnail?: string;
        uploadState?: string;
        lessons?: any[];
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
