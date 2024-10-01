/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { ExerciseItem, ExerciseState } from "../types";

const initialState: ExerciseState = {
  exercise: {
    data: [],
    updatingExercise: null,
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
  },
};

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    setSubmittedExercises: (
      state,
      action: PayloadAction<{
        data?: any[];
        updatingExercise?: ExerciseItem | null;
        state?: string;
        currentPage?: number;
        totalPages?: number;
      }>
    ) => {
      state.exercise = {
        ...state.exercise,
        ...action.payload,
      };
    },
  },
});

export const { setSubmittedExercises } = exerciseSlice.actions;

export default exerciseSlice.reducer;
