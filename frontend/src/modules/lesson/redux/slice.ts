import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { CourseType, LessonState, LessonType, StudentLesson } from "../types";

const initialState: LessonState = {
  lesson: {
    data: [],
    updatingLesson: null,
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
  },
  createLesson: {
    courses: [],
    videoUrl: "",
    attachments: [],
    exercises: [],
    uploadState: {
      video: "",
      attachment: "",
      exercise: "",
    },
  },
  studentLessons: {
    data: [],
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
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
        courses?: CourseType[];
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
    setStudentLessons: (
      state,
      action: PayloadAction<{
        data?: StudentLesson[];
        state?: string;
        currentPage?: number;
        totalPages?: number;
      }>
    ) => {
      state.studentLessons = {
        ...state.studentLessons,
        ...action.payload,
      };
    },
  },
});

export const { setLesson, setCreateLesson, setStudentLessons } =
  lessonSlice.actions;

export default lessonSlice.reducer;
