import { authorizedApi } from "../../base";
import {
  GetClassesResponse,
  CreateClassAPIData,
  GetClassAPIData,
  GetClassesAPIData,
  MajorResponse,
  UpdateClassAPIData,
  GetClassResponse,
} from "../types";

export const apiGetClasses = (
  data: GetClassesAPIData
): Promise<GetClassesResponse> => {
  return authorizedApi.get(
    `/classes?page=${data.page}&limit=${data.limit}${
      data.search ? `&search=${encodeURIComponent(data.search)}` : ""
    }`
  );
};

export const apiGetPublishedClasses = (
  data: GetClassesAPIData
): Promise<GetClassesResponse> => {
  return authorizedApi.get(
    `/classes/published?page=${data.page}&limit=${data.limit}${
      data.search ? `&search=${encodeURIComponent(data.search)}` : ""
    }${data.majorId ? `&majorId=${data.majorId}` : ""}`
  );
};

export const apiGetClass = (
  data: GetClassAPIData
): Promise<GetClassResponse> => {
  return authorizedApi.get(`/classes/${data.id}`);
};

export const apiCreateClass = (data: CreateClassAPIData) => {
  return authorizedApi.post(`/classes`, data);
};

export const apiUpdateClass = (data: UpdateClassAPIData) => {
  return authorizedApi.patch(`/classes/${data.id}`, data.body);
};

export const apiGetMajors = (): Promise<MajorResponse> => {
  return authorizedApi.get(`/majors`);
};

export const apiUploadFile = (file: any): Promise<any> => {
  return authorizedApi.post(`/upload/file`, { file });
};

export const apiUploadFiles = (files: any): Promise<any> => {
  return authorizedApi.post(`/upload/files`, { files });
};

export const apiJoinClass = (classCode: string, userId: string) => {
  return authorizedApi.post(`/classes/${classCode}/join`, { userId });
};
