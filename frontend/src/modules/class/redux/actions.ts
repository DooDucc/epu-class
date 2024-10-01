import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiCreateClass,
  apiGetClass,
  apiGetClasses,
  apiGetMajors,
  apiGetPublishedClasses,
  apiJoinClass,
  apiUpdateClass,
  apiUploadFile,
} from "./services";
import { setClass, setCreateClass } from "./slice";
import { COMPONENT_STAGES } from "../../base/utils";
import {
  ClassState,
  CreateClassesParams,
  GetClassesParams,
  GetClassParams,
  JoinClassParams,
  UpdateClassesParams,
  UploadParams,
} from "../types";
import { toast } from "react-toastify";
import { apiGetCourse } from "../../course/redux/services";

export const getClasses = createAsyncThunk(
  "class/getClasses",
  async (
    { page = 1, limit = 5, search = "" }: GetClassesParams,
    { dispatch }
  ) => {
    try {
      dispatch(
        setClass({
          state: COMPONENT_STAGES.LOADING,
        })
      );

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
    { page = 1, limit = 9, search = "", majorId = "" }: GetClassesParams,
    { dispatch }
  ) => {
    try {
      dispatch(
        setClass({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetPublishedClasses({
        page,
        limit,
        search,
        majorId,
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

      if (isStudent) {
        const coursesInClass = res?.data?.courses;
        const courseInfos = await Promise.all(
          coursesInClass.map((course: any) => apiGetCourse({ id: course.id }))
        );
        dispatch(
          setClass({
            updatingClass: res?.data,
            courses: courseInfos?.map((course: any) => course.data),
            state: COMPONENT_STAGES.SUCCESS,
          })
        );
        return;
      }

      dispatch(
        setClass({
          updatingClass: res?.data,
          state: COMPONENT_STAGES.SUCCESS,
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
      majorId,
      teacherId,
      thumbnailUrl,
      handleSuccess,
    }: CreateClassesParams,
    { dispatch }
  ) => {
    try {
      await apiCreateClass({
        classCode,
        className,
        isPublished,
        majorId,
        teacherId,
        thumbnailUrl,
      });

      handleSuccess();
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
  async (
    {
      id,
      classCode,
      className,
      isPublished,
      majorId,
      teacherId,
      thumbnailUrl,
      handleSuccess,
      handleFail,
    }: UpdateClassesParams,
    { getState }
  ) => {
    try {
      const {
        class: {
          class: { data: classes },
        },
      } = getState() as { class: ClassState };
      const currentClass = classes.find((cls) => cls.id === id);

      if (!currentClass) {
        toast.error("Class not found");
        return;
      }

      await apiUpdateClass({
        id,
        body: {
          classCode: classCode ?? currentClass?.classCode,
          className: className ?? currentClass?.className,
          isPublished: isPublished ?? currentClass?.isPublished,
          majorId: majorId ?? currentClass?.major.id,
          teacherId: teacherId ?? currentClass?.teacherId,
          thumbnailUrl: thumbnailUrl ?? currentClass?.thumbnail,
        },
      });

      handleSuccess();
    } catch (error) {
      console.log(error);
      handleFail();
    }
  }
);

export const getMajors = createAsyncThunk(
  "class/getMajors",
  async (_, { dispatch }) => {
    try {
      const res = await apiGetMajors();

      dispatch(
        setCreateClass({
          majors: res?.data,
        })
      );
    } catch (error) {
      console.error("Error fetching majors:", error);
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
