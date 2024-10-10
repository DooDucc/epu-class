import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetClasses,
  apiGetClassExerciseStats,
  apiGetCourseExerciseStats,
  apiGetCourses,
  apiGetStudentsByCourseAndYear,
  apiGetStudentsByYear,
  apiGetSubmittedExerciseStats,
  apiGetTotalInfo,
} from "./services";
import {
  setClasses,
  setClassExerciseStats,
  setCourseExerciseStats,
  setCourses,
  setStudentsByClass,
  setStudentsByCourse,
  setSubmittedExerciseStats,
  setTotalInfo,
} from "./slice";
import { COMPONENT_STAGES } from "../../base";
import {
  GetClassExerciseStatsParams,
  GetCourseExerciseStatsParams,
  GetStudentsByClassParams,
  GetStudentsByCourseParams,
  GetSubmittedExerciseStatsParams,
} from "../types";

export const getStudentsByClass = createAsyncThunk(
  "report/getStudentsByClass",
  async ({ classId, year }: GetStudentsByClassParams, { dispatch }) => {
    try {
      dispatch(
        setStudentsByClass({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetStudentsByYear(classId, year);

      dispatch(
        setStudentsByClass({
          data: res?.data,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setStudentsByClass({
          data: [],
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getStudentsByCourse = createAsyncThunk(
  "report/getStudentsByCourse",
  async ({ courseId, year }: GetStudentsByCourseParams, { dispatch }) => {
    try {
      dispatch(
        setStudentsByCourse({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetStudentsByCourseAndYear(courseId, year);

      dispatch(
        setStudentsByCourse({
          data: res?.data,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setStudentsByCourse({
          data: [],
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getSubmittedExerciseStats = createAsyncThunk(
  "report/getSubmittedExerciseStats",
  async ({ lessonId }: GetSubmittedExerciseStatsParams, { dispatch }) => {
    try {
      dispatch(
        setSubmittedExerciseStats({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetSubmittedExerciseStats(lessonId);

      dispatch(
        setSubmittedExerciseStats({
          data: res?.data,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setSubmittedExerciseStats({
          data: [],
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getCourseExerciseStats = createAsyncThunk(
  "report/getCourseExerciseStats",
  async ({ courseId }: GetCourseExerciseStatsParams, { dispatch }) => {
    try {
      dispatch(
        setCourseExerciseStats({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetCourseExerciseStats(courseId);

      dispatch(
        setCourseExerciseStats({
          data: {
            totalSubmissions: res?.data?.totalSubmissions,
            percentages: res?.data?.percentages,
          },
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setCourseExerciseStats({
          data: {
            totalSubmissions: 0,
            percentages: {
              lowRange: 0,
              midRange: 0,
              highRange: 0,
            },
          },
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getClassExerciseStats = createAsyncThunk(
  "report/getClassExerciseStats",
  async ({ classId }: GetClassExerciseStatsParams, { dispatch }) => {
    try {
      dispatch(
        setClassExerciseStats({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetClassExerciseStats(classId);

      dispatch(
        setClassExerciseStats({
          data: {
            totalSubmissions: res?.data?.totalSubmissions,
            percentages: res?.data?.percentages,
          },
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setClassExerciseStats({
          data: {
            totalSubmissions: 0,
            percentages: {
              lowRange: 0,
              midRange: 0,
              highRange: 0,
            },
          },
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getClasses = createAsyncThunk(
  "report/getClasses",
  async (_, { dispatch }) => {
    try {
      dispatch(
        setClasses({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetClasses();

      dispatch(
        setClasses({
          data: res?.data?.classes,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setClasses({
          data: [],
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getCourses = createAsyncThunk(
  "report/getCourses",
  async (_, { dispatch }) => {
    try {
      dispatch(
        setCourses({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetCourses();

      dispatch(
        setCourses({
          data: res?.data?.courses,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setCourses({
          data: [],
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getTotalInfo = createAsyncThunk(
  "report/getTotalInfo",
  async (_, { dispatch }) => {
    try {
      dispatch(
        setTotalInfo({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetTotalInfo();

      dispatch(
        setTotalInfo({
          data: res?.data,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setTotalInfo({
          data: {
            classCount: 0,
            courseCount: 0,
            lessonCount: 0,
            studentCount: 0,
          },
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);
