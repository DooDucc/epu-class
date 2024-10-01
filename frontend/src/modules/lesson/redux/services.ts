/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizedApi } from "../../base";
import { GetCoursesResponse } from "../../course/types";
import {
  GetLessonAPIData,
  GetLessonResponse,
  GetLessonsAPIData,
  GetLessonsResponse,
  GetStudentLessonsResponse,
} from "../types";

export const apiGetLessons = (
  data: GetLessonsAPIData
): Promise<GetLessonsResponse> => {
  return authorizedApi.get(
    `/lessons?page=${data.page}&limit=${data.limit}${
      data.search ? `&search=${encodeURIComponent(data.search)}` : ""
    }`
  );
};

export const apiGetLesson = (
  data: GetLessonAPIData
): Promise<GetLessonResponse> => {
  return authorizedApi.get(`/lessons/${data.id}`);
};

export const apiDeleteLesson = (data: GetLessonAPIData) => {
  return authorizedApi.delete(`/lessons/${data.id}`);
};

export const apiCreateLesson = (data: any) => {
  return authorizedApi.post(`/lessons`, data);
};

export const apiUpdateLesson = (data: any) => {
  return authorizedApi.patch(`/lessons/${data.id}`, data.body);
};

export const apiGetCourses = (): Promise<GetCoursesResponse> => {
  return authorizedApi.get(`/courses/all`);
};

export const apiGetStudentLessons = (
  studentId: string
): Promise<GetStudentLessonsResponse> => {
  return authorizedApi.get(`/lessons/student/${studentId}`);
};
