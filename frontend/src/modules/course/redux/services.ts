/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizedApi } from "../../base";
import { GetClassesResponse } from "../../class/types";
import { GetLessonsResponse } from "../../lesson/types";
import {
  GetCourseAPIData,
  GetCourseResponse,
  GetCoursesAPIData,
  GetCoursesResponse,
  GetLessonsAPIData,
} from "../types";

export const apiGetCourses = (
  data: GetCoursesAPIData
): Promise<GetCoursesResponse> => {
  return authorizedApi.get(
    `/courses?page=${data.page}&limit=${data.limit}${
      data.search ? `&search=${encodeURIComponent(data.search)}` : ""
    }`
  );
};

export const apiGetCourse = (
  data: GetCourseAPIData
): Promise<GetCourseResponse> => {
  return authorizedApi.get(`/courses/${data.id}`);
};

export const apiDeleteCourse = (data: GetCourseAPIData) => {
  return authorizedApi.delete(`/courses/${data.id}`);
};

export const apiCreateCourse = (data: any) => {
  return authorizedApi.post(`/courses`, data);
};

export const apiUpdateCourse = (data: any) => {
  return authorizedApi.patch(`/courses/${data.id}`, data.body);
};

export const apiGetClasses = (): Promise<GetClassesResponse> => {
  return authorizedApi.get(`/classes/all`);
};

export const apiGetLessons = (
  data: GetLessonsAPIData
): Promise<GetLessonsResponse> => {
  return authorizedApi.get(`/lessons/all/${data.courseId}`);
};

export const apiUpdateLessonPositions = (data: any) => {
  return authorizedApi.patch(`/lessons/update-positions`, data);
};

export const apiRegisterCourse = (data: any) => {
  return authorizedApi.post(`/courses/${data.id}/register`, data.body);
};

export const apiUpdateLessonProgress = (data: any) => {
  return authorizedApi.patch(`/lessons/progress`, data);
};

export const apiGetNote = (data: any) => {
  return authorizedApi.get(`/lessons/note/${data.lessonId}/${data.studentId}`);
};

export const apiUpdateNote = (data: any) => {
  return authorizedApi.patch(`/lessons/note`, data);
};

export const apiGetSubmittedExercise = (data: any) => {
  return authorizedApi.get(
    `/lessons/submitted-exercise/${data.lessonId}/${data.studentId}`
  );
};

export const apiSubmitExercise = (data: any) => {
  return authorizedApi.post(`/lessons/submit-exercise`, data);
};
