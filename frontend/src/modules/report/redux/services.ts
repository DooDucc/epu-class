import { authorizedApi } from "../../base";
import {
  ClassesResponse,
  ClassExerciseStatsResponse,
  StudentByClassResponse,
  TopStudentsResponse,
  TotalInfoResponse,
} from "../types";

export const apiGetStudentsByYear = (
  classId: string,
  year: number
): Promise<StudentByClassResponse> => {
  return authorizedApi.get(`/reports/students/classes/${classId}/${year}`);
};

export const apiGetLessonExerciseStats = (
  lessonId: string
): Promise<ClassExerciseStatsResponse> => {
  return authorizedApi.get(`/reports/lesson-exercise-stats/${lessonId}`);
};

export const apiGetClassExerciseStats = (
  classId: string
): Promise<ClassExerciseStatsResponse> => {
  return authorizedApi.get(`/reports/class-exercise-stats/${classId}`);
};

export const apiGetClasses = (): Promise<ClassesResponse> => {
  return authorizedApi.get("/classes/all");
};

export const apiGetTotalInfo = (): Promise<TotalInfoResponse> => {
  return authorizedApi.get("/reports/total-info");
};

export const apiGetTopStudentsByClass = (
  classId: string
): Promise<TopStudentsResponse> => {
  return authorizedApi.get(`/reports/top-students/${classId}`);
};
