import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import {
  AmountOfStudents,
  Class,
  ClassExerciseStats,
  Course,
  CourseExerciseStats,
  ReportState,
  TotalInfo,
} from "../types";

const initialState: ReportState = {
  studentsByClass: {
    data: [],
    state: COMPONENT_STAGES.LOADING,
  },
  studentsByCourse: {
    data: [],
    state: COMPONENT_STAGES.LOADING,
  },
  submittedExerciseStats: {
    data: [],
    state: COMPONENT_STAGES.LOADING,
  },
  courseExerciseStats: {
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
  courses: {
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
      courseCount: 0,
      lessonCount: 0,
      studentCount: 0,
    },
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
    setStudentsByCourse: (
      state,
      action: PayloadAction<{
        data?: AmountOfStudents[];
        state?: string;
      }>
    ) => {
      state.studentsByCourse = { ...state.studentsByCourse, ...action.payload };
    },
    setSubmittedExerciseStats: (
      state,
      action: PayloadAction<{
        data?: any;
        state?: string;
      }>
    ) => {
      state.submittedExerciseStats = {
        ...state.submittedExerciseStats,
        ...action.payload,
      };
    },
    setCourseExerciseStats: (
      state,
      action: PayloadAction<{
        data?: CourseExerciseStats;
        state?: string;
      }>
    ) => {
      state.courseExerciseStats = {
        ...state.courseExerciseStats,
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
    setCourses: (
      state,
      action: PayloadAction<{
        data?: Course[];
        state?: string;
      }>
    ) => {
      state.courses = { ...state.courses, ...action.payload };
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
  },
});

export const {
  setStudentsByClass,
  setStudentsByCourse,
  setSubmittedExerciseStats,
  setCourseExerciseStats,
  setClassExerciseStats,
  setClasses,
  setCourses,
  setTotalInfo,
} = reportSlice.actions;

export default reportSlice.reducer;
