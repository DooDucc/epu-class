/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { CourseState } from "../types";
import { Class } from "../../class/types";

const initialState: CourseState = {
  course: {
    data: [],
    updatingCourse: null,
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
    searchTerm: "",
  },
  courseDetails: {
    note: "",
    submittedExercise: null,
  },
  createCourse: {
    classes: [],
    lessons: [],
    thumbnail: "",
    uploadState: "",
  },
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (
      state,
      action: PayloadAction<{
        data?: any[];
        updatingCourse?: any;
        state?: string;
        currentPage?: number;
        totalPages?: number;
        searchTerm?: string;
      }>
    ) => {
      state.course = {
        ...state.course,
        ...action.payload,
      };
    },
    setCreateCourse: (
      state,
      action: PayloadAction<{
        classes?: Class[];
        lessons?: any[];
        thumbnail?: string;
        uploadState?: string;
      }>
    ) => {
      state.createCourse = {
        ...state.createCourse,
        ...action.payload,
      };
    },
    setCourseDetails: (
      state,
      action: PayloadAction<{
        note?: string;
        submittedExercise?: any;
      }>
    ) => {
      state.courseDetails = {
        ...state.courseDetails,
        ...action.payload,
      };
    },
  },
});

export const { setCourse, setCreateCourse, setCourseDetails } =
  courseSlice.actions;

export default courseSlice.reducer;
