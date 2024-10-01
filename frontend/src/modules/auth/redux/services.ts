import { unAuthorizedApi, authorizedApi } from "../../base";
import { LoginAPIData, LoginResponse } from "../types";

export const apiLogin = (data: LoginAPIData): Promise<LoginResponse> => {
  return unAuthorizedApi.post(`/auth/login`, data);
};

export const apiRegister = (data: any): Promise<LoginResponse> => {
  return unAuthorizedApi.post(`/auth/register`, data);
};

export const apiGetProfile = (): Promise<any> => {
  return authorizedApi.get(`/auth/me`);
};
