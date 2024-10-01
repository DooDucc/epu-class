import { authorizedApi } from "../../base";
import {
  GetStudentsAPIData,
  GetStudentsResponse,
  GetStudentResponse,
} from "../types";

export const apiGetStudents = (
  data: GetStudentsAPIData
): Promise<GetStudentsResponse> => {
  return authorizedApi.get(
    `/students?page=${data.page}&limit=${data.limit}${
      data.search ? `&search=${encodeURIComponent(data.search)}` : ""
    }`
  );
};

export const apiGetStudent = (
  studentId: string
): Promise<GetStudentResponse> => {
  return authorizedApi.get(`/students/${studentId}`);
};

export const apiDeleteStudentFromClass = (studentId: string): Promise<void> => {
  return authorizedApi.delete(`/students/${studentId}`);
};
