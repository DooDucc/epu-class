/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetCourses,
  apiGetCourse,
  apiCreateCourse,
  apiUpdateCourse,
  apiGetClasses,
  apiDeleteCourse,
  apiGetLessons,
  apiUpdateLessonPositions,
  apiRegisterCourse,
  apiUpdateLessonProgress,
  apiUpdateNote,
  apiGetNote,
  apiSubmitExercise,
  apiGetSubmittedExercise,
} from "./services";
import { setCourse, setCourseDetails, setCreateCourse } from "./slice";
import { COMPONENT_STAGES } from "../../base/utils";
import {
  CourseState,
  CreateCourseParams,
  GetCoursesParams,
  GetCourseParams,
  UpdateCourseParams,
  DeleteCourseParams,
  GetLessonsParams,
  UpdateLessonPositionsParams,
  RegisterCourseParams,
  UpdateLessonProgressParams,
  UpdateNoteParams,
  GetNoteParams,
  SubmitExerciseParams,
  GetSubmittedExerciseParams,
} from "../types";
import { toast } from "react-toastify";

export const getCourses = createAsyncThunk(
  "course/getCourses",
  async (
    { page = 1, limit = 5, search = "" }: GetCoursesParams,
    { dispatch }
  ) => {
    try {
      dispatch(
        setCourse({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const res = await apiGetCourses({ page, limit, search });

      dispatch(
        setCourse({
          data: res?.data.courses.map((course) => ({
            ...course,
            classId: course.class.classCode,
          })),
          currentPage: res?.data.currentPage,
          totalPages: res?.data.totalPages,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch (error) {
      dispatch(
        setCourse({
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getCourse = createAsyncThunk(
  "course/getCourse",
  async ({ id }: GetCourseParams, { dispatch }) => {
    try {
      const res = await apiGetCourse({ id });
      dispatch(
        setCourse({
          updatingCourse: res?.data,
        })
      );
    } catch (err: any) {}
  }
);

export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (
    {
      title,
      desc,
      isPublished,
      teacherId,
      classId,
      imageUrl,
      handleSuccess,
    }: CreateCourseParams,
    { dispatch }
  ) => {
    try {
      const res = await apiCreateCourse({
        title,
        desc,
        isPublished,
        teacherId,
        classId,
        imageUrl,
      });

      handleSuccess(res?.data.id);
    } catch (error) {
      dispatch(
        setCourse({
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async (
    {
      id,
      title,
      desc,
      isPublished,
      teacherId,
      classId,
      imageUrl,
      handleSuccess,
      handleFail,
    }: UpdateCourseParams,
    { getState }
  ) => {
    try {
      const {
        course: {
          course: { data: courses },
        },
      } = getState() as { course: CourseState };
      const currentCourse = courses.find((course) => course.id === id);

      if (!currentCourse) {
        toast.error("Course not found");
        return;
      }

      await apiUpdateCourse({
        id,
        body: {
          title: title ?? currentCourse.title,
          desc: desc ?? currentCourse.desc,
          isPublished: isPublished ?? currentCourse.isPublished,
          teacherId: teacherId ?? currentCourse.teacher.id,
          classId: classId ?? currentCourse.class.id,
          imageUrl: imageUrl ?? currentCourse.imageUrl,
        },
      });

      handleSuccess();
    } catch (error) {
      handleFail();
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({ id, handleSuccess, handleFail }: DeleteCourseParams) => {
    try {
      await apiDeleteCourse({ id });
      handleSuccess();
    } catch (error) {
      handleFail();
    }
  }
);

export const getClasses = createAsyncThunk(
  "course/getClasses",
  async (_, { dispatch }) => {
    try {
      const res = await apiGetClasses();

      dispatch(
        setCreateCourse({
          classes: res?.data.classes,
        })
      );
    } catch (error) {
      dispatch(
        setCreateCourse({
          classes: [],
        })
      );
    }
  }
);

export const getLessons = createAsyncThunk(
  "course/getLessons",
  async ({ courseId }: GetLessonsParams, { dispatch }) => {
    try {
      const res = await apiGetLessons({ courseId });

      dispatch(
        setCreateCourse({
          lessons: res?.data.lessons,
        })
      );
    } catch (error) {
      dispatch(
        setCreateCourse({
          lessons: [],
        })
      );
    }
  }
);

export const updateLessonPositions = createAsyncThunk(
  "course/updateLessonPositions",
  async ({
    courseId,
    lessons,
    handleSuccess,
    handleFail,
  }: UpdateLessonPositionsParams) => {
    try {
      await apiUpdateLessonPositions({ courseId, lessons });
      handleSuccess();
    } catch (error) {
      handleFail();
    }
  }
);

export const registerCourse = createAsyncThunk(
  "course/registerCourse",
  async ({ id, body, handleSuccess, handleFail }: RegisterCourseParams) => {
    try {
      await apiRegisterCourse({ id, body });
      handleSuccess();
    } catch (error) {
      handleFail();
    }
  }
);

export const updateLessonProgress = createAsyncThunk(
  "course/updateLessonProgress",
  async ({ lessonId, studentId, isCompleted }: UpdateLessonProgressParams) => {
    try {
      await apiUpdateLessonProgress({ lessonId, studentId, isCompleted });
    } catch (error) {}
  }
);

export const getNote = createAsyncThunk(
  "course/getNote",
  async ({ lessonId, studentId }: GetNoteParams, { dispatch }) => {
    try {
      const res = await apiGetNote({ lessonId, studentId });

      if (res.data) {
        dispatch(
          setCourseDetails({
            note: res.data.content,
          })
        );
      }
    } catch (error) {
      dispatch(
        setCourseDetails({
          note: "",
        })
      );
    }
  }
);

export const updateNote = createAsyncThunk(
  "course/updateNote",
  async ({
    lessonId,
    studentId,
    content,
    handleSuccess,
    handleFail,
  }: UpdateNoteParams) => {
    try {
      await apiUpdateNote({ lessonId, studentId, content });
      handleSuccess?.();
    } catch (error) {
      handleFail?.();
    }
  }
);

export const getSubmittedExercise = createAsyncThunk(
  "course/getSubmittedExercise",
  async ({ lessonId, studentId }: GetSubmittedExerciseParams, { dispatch }) => {
    try {
      const res = await apiGetSubmittedExercise({ lessonId, studentId });
      dispatch(
        setCourseDetails({
          submittedExercise: res?.data,
        })
      );
    } catch (error) {}
  }
);

export const submitExercise = createAsyncThunk(
  "course/submitExercise",
  async ({
    lessonId,
    studentId,
    exercises,
    teacherId,
    handleSuccess,
    handleFail,
  }: SubmitExerciseParams) => {
    try {
      await apiSubmitExercise({ lessonId, studentId, teacherId, exercises });
      handleSuccess();
    } catch (error) {
      handleFail();
    }
  }
);
