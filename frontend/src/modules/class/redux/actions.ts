import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiCreateClass,
  apiDeleteClass,
  apiGetClass,
  apiGetClasses,
  apiGetLessons,
  apiGetPublishedClasses,
  apiJoinClass,
  apiUpdateClass,
  apiUpdateLessonPositions,
  apiUploadFile,
} from "./services";
import { setClass, setCreateClass } from "./slice";
import { COMPONENT_STAGES } from "../../base/utils";
import {
  ClassState,
  CreateClassesParams,
  DeleteClassParams,
  GetClassesParams,
  GetClassParams,
  JoinClassParams,
  UpdateClassesParams,
  UpdateLessonPositionsParams,
  UploadParams,
} from "../types";
import { toast } from "react-toastify";

export const getClasses = createAsyncThunk(
  "class/getClasses",
  async (
    { page = 1, limit = 5, search = "", isLoading = false }: GetClassesParams,
    { dispatch }
  ) => {
    try {
      if (isLoading) {
        dispatch(
          setClass({
            state: COMPONENT_STAGES.LOADING,
          })
        );
      }

      const res = await apiGetClasses({ page, limit, search });

      dispatch(
        setClass({
          data: res?.data.classes,
          currentPage: res?.data.currentPage,
          totalPages: res?.data.totalPages,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch (error) {
      dispatch(
        setClass({
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getPublishedClasses = createAsyncThunk(
  "class/getPublishedClasses",
  async (
    { page = 1, limit = 9, search = "" }: GetClassesParams,
    { dispatch }
  ) => {
    try {
      const res = await apiGetPublishedClasses({
        page,
        limit,
        search,
      });

      dispatch(
        setClass({
          data: res?.data.classes,
          currentPage: res?.data.currentPage,
          totalPages: res?.data.totalPages,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch (error) {
      dispatch(
        setClass({
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getClass = createAsyncThunk(
  "class/getClass",
  async ({ id, isStudent = false }: GetClassParams, { dispatch }) => {
    try {
      dispatch(
        setClass({
          state: COMPONENT_STAGES.LOADING,
        })
      );
      const res = await apiGetClass({ id });

      dispatch(
        setClass({
          updatingClass: res?.data,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
      dispatch(
        setCreateClass({
          lessons: res?.data.lessons,
        })
      );
    } catch (err: any) {
      dispatch(
        setClass({
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const createClasses = createAsyncThunk(
  "class/createClasses",
  async (
    {
      classCode,
      className,
      isPublished,
      teacherId,
      desc,
      thumbnailUrl,
      handleSuccess,
    }: CreateClassesParams,
    { dispatch }
  ) => {
    try {
      const res = await apiCreateClass({
        classCode,
        className,
        isPublished,
        teacherId,
        thumbnailUrl,
        desc,
      });

      handleSuccess(res?.data.id);
    } catch (error) {
      dispatch(
        setClass({
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const updateClass = createAsyncThunk(
  "class/updateClass",
  async ({
    id,
    classCode,
    className,
    isPublished,
    teacherId,
    thumbnailUrl,
    desc,
    handleSuccess,
    handleFail,
  }: UpdateClassesParams) => {
    try {
      await apiUpdateClass({
        id,
        body: {
          classCode,
          className,
          desc,
          isPublished,
          teacherId,
          thumbnailUrl,
        },
      });

      handleSuccess();
    } catch (error) {
      console.log(error);
      handleFail();
    }
  }
);

export const deleteClass = createAsyncThunk(
  "class/deleteClass",
  async (
    { id, handleSuccess, handleFail }: DeleteClassParams,
    { dispatch }
  ) => {
    try {
      await apiDeleteClass(id);
      handleSuccess();
    } catch (error) {
      handleFail();
    }
  }
);

export const uploadFile = createAsyncThunk(
  "class/uploadFile",
  async ({
    file,
    handleFail,
    handleSuccess,
    handleUploading,
  }: UploadParams) => {
    try {
      handleUploading();

      const res = await apiUploadFile(file);

      handleSuccess(res.data);
    } catch (error) {
      handleFail();
    }
  }
);

export const joinClass = createAsyncThunk(
  "class/joinClass",
  async ({ classCode, userId, handleSuccess, handleFail }: JoinClassParams) => {
    try {
      await apiJoinClass(classCode, userId);
      handleSuccess();
    } catch (error: any) {
      handleFail(error?.response?.data?.error);
    }
  }
);

export const getLessons = createAsyncThunk(
  "class/getLessons",
  async ({ classId }: { classId: string }, { dispatch }) => {
    try {
      const res = await apiGetLessons({ classId });

      dispatch(
        setCreateClass({
          lessons: res?.data.lessons,
        })
      );
    } catch (error) {
      dispatch(
        setCreateClass({
          lessons: [],
        })
      );
    }
  }
);

export const updateLessonPositions = createAsyncThunk(
  "class/updateLessonPositions",
  async ({
    classId,
    lessons,
    handleSuccess,
    handleFail,
  }: UpdateLessonPositionsParams) => {
    try {
      await apiUpdateLessonPositions({ classId, lessons });
      handleSuccess();
    } catch (error) {
      handleFail();
    }
  }
);
