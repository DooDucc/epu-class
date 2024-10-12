import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { CourseType, LessonState, LessonType, StudentCourse } from "../types";

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
  studentCourse: {
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
    setStudentCourse: (
      state,
      action: PayloadAction<{
        data?: StudentCourse[];
      }>
    ) => {
      state.studentCourse = {
        ...state.studentCourse,
        ...action.payload,
      };
    },
  },
});

export const { setLesson, setCreateLesson, setStudentCourse } =
  lessonSlice.actions;

export default lessonSlice.reducer;
