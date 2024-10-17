/* eslint-disable no-empty */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetLessons,
  apiGetLesson,
  apiCreateLesson,
  apiUpdateLesson,
  apiDeleteLesson,
  apiGetStudentLessons,
  apiGetClasses,
} from "./services";
import { setLesson, setCreateLesson, setStudentLesson } from "./slice";
import { COMPONENT_STAGES } from "../../base/utils";
import {
  LessonState,
  CreateLessonParams,
  GetLessonsParams,
  GetLessonParams,
  UpdateLessonParams,
  DeleteLessonParams,
  GetStudentLessonsParams,
} from "../types";
import { handleConvertLessonsOfClass } from "./functions";

export const getLessons = createAsyncThunk(
  "lesson/getLessons",
  async (
    { page = 1, limit = 5, search = "", isLoading = false }: GetLessonsParams,
    { dispatch }
  ) => {
    try {
      if (isLoading) {
        dispatch(
          setLesson({
            state: COMPONENT_STAGES.LOADING,
          })
        );
      }

      const res = await apiGetLessons({ page, limit, search });

      dispatch(
        setLesson({
          data: res?.data.lessons,
          currentPage: res?.data.currentPage,
          totalPages: res?.data.totalPages,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        setLesson({
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getLesson = createAsyncThunk(
  "lesson/getLesson",
  async ({ id }: GetLessonParams, { dispatch }) => {
    try {
      const res = await apiGetLesson({ id });
      dispatch(
        setLesson({
          updatingLesson: res?.data,
        })
      );
    } catch {}
  }
);

export const createLesson = createAsyncThunk(
  "lesson/createLesson",
  async (
    {
      title,
      desc,
      isPublished,
      videoUrl,
      classId,
      exercises,
      attachments,
      videoDuration,
      handleSuccess,
    }: CreateLessonParams,
    { dispatch }
  ) => {
    try {
      await apiCreateLesson({
        title,
        desc,
        isPublished,
        videoUrl,
        classId,
        exercises,
        attachments,
        videoDuration,
      });

      handleSuccess();
    } catch {
      dispatch(
        setLesson({
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const updateLesson = createAsyncThunk(
  "lesson/updateLesson",
  async (
    {
      id,
      title,
      desc,
      position,
      isPublished,
      videoUrl,
      classId,
      videoDuration,
      handleSuccess,
      handleFail,
    }: UpdateLessonParams,
    { getState }
  ) => {
    try {
      const {
        lesson: {
          lesson: { updatingLesson },
          createLesson: { exercises, attachments },
        },
      } = getState() as { lesson: LessonState };

      await apiUpdateLesson({
        id,
        body: {
          title,
          desc,
          isPublished,
          videoUrl,
          classId,
          position,
          exercises,
          attachments: attachments ?? updatingLesson?.attachments,
          videoDuration: videoDuration ?? updatingLesson?.videoDuration,
        },
      });

      handleSuccess();
    } catch {
      handleFail();
    }
  }
);

export const getClasses = createAsyncThunk(
  "lesson/getClasses",
  async (_, { dispatch }) => {
    try {
      const res = await apiGetClasses();

      dispatch(
        setCreateLesson({
          classes: res?.data.classes,
        })
      );
    } catch {
      dispatch(
        setCreateLesson({
          classes: [],
        })
      );
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "lesson/deleteLesson",
  async ({ id, handleSuccess, handleFail }: DeleteLessonParams) => {
    try {
      await apiDeleteLesson({ id });
      handleSuccess();
    } catch {
      handleFail();
    }
  }
);

export const getStudentLessons = createAsyncThunk(
  "lesson/getStudentLessons",
  async ({ studentId }: GetStudentLessonsParams, { dispatch }) => {
    try {
      const res = await apiGetStudentLessons(studentId);
      const data = handleConvertLessonsOfClass(res?.data.lessons);
      dispatch(
        setStudentLesson({
          data,
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        setStudentLesson({
          data: [],
        })
      );
    }
  }
);
