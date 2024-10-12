/* eslint-disable no-empty */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetLessons,
  apiGetLesson,
  apiCreateLesson,
  apiUpdateLesson,
  apiGetCourses,
  apiDeleteLesson,
  apiGetStudentLessons,
} from "./services";
import { setLesson, setCreateLesson, setStudentLessons } from "./slice";
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
import { handleConvertLessons } from "./functions";

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
          data: res?.data.lessons?.map((lesson) => ({
            ...lesson,
            courseName: lesson?.course?.title,
          })),
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
      courseId,
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
        courseId,
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
      courseId,
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
          title: title ?? updatingLesson?.title,
          desc: desc ?? updatingLesson?.desc,
          isPublished: isPublished ?? updatingLesson?.isPublished,
          videoUrl: videoUrl ?? updatingLesson?.videoUrl,
          courseId: courseId ?? updatingLesson?.course?.id,
          position: position ?? updatingLesson?.position,
          exercises: exercises ?? updatingLesson?.exercises,
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
      const res = await apiGetCourses();

      dispatch(
        setCreateLesson({
          courses: res?.data.courses,
        })
      );
    } catch {
      dispatch(
        setCreateLesson({
          courses: [],
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
      const data = handleConvertLessons(res?.data.lessons);
      dispatch(
        setStudentLessons({
          data,
          state: COMPONENT_STAGES.SUCCESS,
          currentPage: res?.data.currentPage,
          totalPages: res?.data.totalPages,
        })
      );
    } catch {
      dispatch(
        setStudentLessons({
          state: COMPONENT_STAGES.FAIL,
          data: [],
          currentPage: 1,
          totalPages: 0,
        })
      );
    }
  }
);
