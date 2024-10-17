import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { LessonState, LessonType, StudentLesson } from "../types";
import { Class } from "../../class/types";

const initialState: LessonState = {
  lesson: {
    data: [],
    updatingLesson: null,
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
    searchTerm: "",
  },
  createLesson: {
    classes: [],
    videoUrl: "",
    attachments: [],
    exercises: [],
    uploadState: {
      video: "",
      attachment: "",
      exercise: "",
    },
  },
  studentLesson: {
    data: [],
  },
};

export const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setLesson: (
      state,
      action: PayloadAction<{
        data?: LessonType[];
        updatingLesson?: LessonType | null;
        state?: string;
        currentPage?: number;
        totalPages?: number;
        searchTerm?: string;
      }>
    ) => {
      state.lesson = {
        ...state.lesson,
        ...action.payload,
      };
    },
    setCreateLesson: (
      state,
      action: PayloadAction<{
        classes?: Class[];
        videoUrl?: string;
        attachments?: { name: string; url: string }[];
        exercises?: { name: string; url: string }[];
        uploadState?: {
          video: string;
          attachment: string;
          exercise: string;
        };
      }>
    ) => {
      state.createLesson = {
        ...state.createLesson,
        ...action.payload,
      };
    },
    setStudentLesson: (
      state,
      action: PayloadAction<{
        data?: StudentLesson[];
      }>
    ) => {
      state.studentLesson = {
        ...state.studentLesson,
        ...action.payload,
      };
    },
  },
});

export const { setLesson, setCreateLesson, setStudentLesson } =
  lessonSlice.actions;

export default lessonSlice.reducer;
