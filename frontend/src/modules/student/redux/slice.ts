/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { StudentDetail, StudentState } from "../types";

const initialState: StudentState = {
  student: {
    data: [],
    currentStudent: null,
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
  },
};

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudents: (
      state,
      action: PayloadAction<{
        data?: any[];
        currentStudent?: StudentDetail | null;
        state?: string;
        currentPage?: number;
        totalPages?: number;
      }>
    ) => {
      state.student = {
        ...state.student,
        ...action.payload,
      };
    },
  },
});

export const { setStudents } = studentSlice.actions;

export default studentSlice.reducer;
