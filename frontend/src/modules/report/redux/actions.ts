import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetClasses,
  apiGetClassExerciseStats,
  apiGetLessonExerciseStats,
  apiGetStudentsByYear,
  apiGetTopStudentsByClass,
  apiGetTotalInfo,
} from "./services";
import {
  setClasses,
  setClassExerciseStats,
  setLessonExerciseStats,
  setLessons,
  setStudentsByClass,
  setTopStudentsByClass,
  setTotalInfo,
} from "./slice";
import { COMPONENT_STAGES } from "../../base";
import {
  GetClassExerciseStatsParams,
  GetLessonExerciseStatsParams,
  GetStudentsByClassParams,
  GetTopStudentsByClassParams,
} from "../types";
import { apiGetLessons } from "../../lesson/redux/services";

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

export const getLessonExerciseStats = createAsyncThunk(
  "report/getLessonExerciseStats",
  async ({ lessonId }: GetLessonExerciseStatsParams, { dispatch }) => {
    try {
      dispatch(
        setLessonExerciseStats({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetLessonExerciseStats(lessonId);

      dispatch(
        setLessonExerciseStats({
          data: {
            totalSubmissions: res?.data?.totalSubmissions,
            percentages: res?.data?.percentages,
          },
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setLessonExerciseStats({
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

export const getLessons = createAsyncThunk(
  "report/getLessons",
  async (_, { dispatch }) => {
    try {
      dispatch(
        setLessons({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetLessons({ page: 1, limit: 100, search: "" });

      dispatch(
        setLessons({
          data: res?.data?.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
          })),
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setLessons({
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
            lessonCount: 0,
            studentCount: 0,
          },
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getTopStudentsByClass = createAsyncThunk(
  "report/getTopStudentsByClass",
  async ({ classId }: GetTopStudentsByClassParams, { dispatch }) => {
    try {
      dispatch(
        setTopStudentsByClass({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetTopStudentsByClass(classId);

      dispatch(
        setTopStudentsByClass({
          data: res?.data,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setTopStudentsByClass({
          data: [],
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);
