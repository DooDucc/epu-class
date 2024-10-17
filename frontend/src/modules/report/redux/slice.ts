import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import {
  AmountOfStudents,
  Class,
  ClassExerciseStats,
  LessonExerciseStats,
  ReportState,
  TopStudent,
  TotalInfo,
} from "../types";

const initialState: ReportState = {
  studentsByClass: {
    data: [],
    state: COMPONENT_STAGES.LOADING,
  },
  lessonExerciseStats: {
    data: {
      totalSubmissions: 0,
      percentages: {
        lowRange: 0,
        midRange: 0,
        highRange: 0,
      },
    },
    state: COMPONENT_STAGES.LOADING,
  },
  classExerciseStats: {
    data: {
      totalSubmissions: 0,
      percentages: {
        lowRange: 0,
        midRange: 0,
        highRange: 0,
      },
    },
    state: COMPONENT_STAGES.LOADING,
  },
  classes: {
    data: [],
    state: COMPONENT_STAGES.LOADING,
  },
  lessons: {
    data: [],
    state: COMPONENT_STAGES.LOADING,
  },
  totalInfo: {
    data: {
      classCount: 0,
      lessonCount: 0,
      studentCount: 0,
    },
    state: COMPONENT_STAGES.LOADING,
  },
  topStudentsByClass: {
    data: [],
    state: COMPONENT_STAGES.LOADING,
  },
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setStudentsByClass: (
      state,
      action: PayloadAction<{
        data?: AmountOfStudents[];
        state?: string;
      }>
    ) => {
      state.studentsByClass = {
        ...state.studentsByClass,
        ...action.payload,
      };
    },
    setLessonExerciseStats: (
      state,
      action: PayloadAction<{
        data?: LessonExerciseStats;
        state?: string;
      }>
    ) => {
      state.lessonExerciseStats = {
        ...state.lessonExerciseStats,
        ...action.payload,
      };
    },
    setClassExerciseStats: (
      state,
      action: PayloadAction<{
        data?: ClassExerciseStats;
        state?: string;
      }>
    ) => {
      state.classExerciseStats = {
        ...state.classExerciseStats,
        ...action.payload,
      };
    },
    setClasses: (
      state,
      action: PayloadAction<{
        data?: Class[];
        state?: string;
      }>
    ) => {
      state.classes = { ...state.classes, ...action.payload };
    },
    setLessons: (
      state,
      action: PayloadAction<{
        data?: { id: string; title: string }[];
        state?: string;
      }>
    ) => {
      state.lessons = { ...state.lessons, ...action.payload };
    },
    setTotalInfo: (
      state,
      action: PayloadAction<{
        data?: TotalInfo;
        state?: string;
      }>
    ) => {
      state.totalInfo = { ...state.totalInfo, ...action.payload };
    },
    setTopStudentsByClass: (
      state,
      action: PayloadAction<{
        data?: TopStudent[];
        state?: string;
      }>
    ) => {
      state.topStudentsByClass = {
        ...state.topStudentsByClass,
        ...action.payload,
      };
    },
  },
});

export const {
  setStudentsByClass,
  setLessonExerciseStats,
  setClassExerciseStats,
  setClasses,
  setTotalInfo,
  setLessons,
  setTopStudentsByClass,
} = reportSlice.actions;

export default reportSlice.reducer;
