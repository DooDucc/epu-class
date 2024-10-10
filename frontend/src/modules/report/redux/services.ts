import { authorizedApi } from "../../base";
import {
  ClassesResponse,
  ClassExerciseStatsResponse,
  CourseExerciseStatsResponse,
  CoursesResponse,
  StudentByClassResponse,
  StudentByCourseResponse,
  TotalInfoResponse,
} from "../types";

export const apiGetStudentsByYear = (
  classId: string,
  year: number
): Promise<StudentByClassResponse> => {
  return authorizedApi.get(`/reports/students/classes/${classId}/${year}`);
};

export const apiGetStudentsByCourseAndYear = (
  courseId: string,
  year: number
): Promise<StudentByCourseResponse> => {
  return authorizedApi.get(`/reports/students/courses/${courseId}/${year}`);
};

export const apiGetSubmittedExerciseStats = (lessonId: string) => {
  return authorizedApi.get(`/reports/submitted-exercises/${lessonId}`);
};

export const apiGetCourseExerciseStats = (
  courseId: string
): Promise<ClassExerciseStatsResponse> => {
  return authorizedApi.get(`/reports/course-exercise-stats/${courseId}`);
};

export const apiGetClassExerciseStats = (
  classId: string
): Promise<CourseExerciseStatsResponse> => {
  return authorizedApi.get(`/reports/class-exercise-stats/${classId}`);
};

export const apiGetClasses = (): Promise<ClassesResponse> => {
  return authorizedApi.get("/classes/all");
};

export const apiGetCourses = (): Promise<CoursesResponse> => {
  return authorizedApi.get("/courses/all");
};

export const apiGetLessons = (courseId: string) => {
  return authorizedApi.get(`/lessons/${courseId}`);
};

export const apiGetTotalInfo = (): Promise<TotalInfoResponse> => {
  return authorizedApi.get("/reports/total-info");
};
