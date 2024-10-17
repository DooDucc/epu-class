/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizedApi } from "../../base";
import { GetClassesResponse } from "../../class/types";
import {
  GetLessonAPIData,
  GetLessonResponse,
  GetLessonsAPIData,
  GetLessonsResponse,
  GetStudentCoursesResponse,
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

export const apiGetClasses = (): Promise<GetClassesResponse> => {
  return authorizedApi.get(`/classes/all`);
};

export const apiGetStudentLessons = (
  studentId: string
): Promise<GetStudentCoursesResponse> => {
  return authorizedApi.get(`/lessons/student/${studentId}`);
};
