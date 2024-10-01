import axios from "axios";
import { BASE_API_URL } from "../../../envVariables";
import { storage } from "./storage";
import { AUTH_CONSTANTS } from "../utils";

export const unAuthorizedApi = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authorizedApi = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authorizedApi.interceptors.request.use(
  (axiosConfig) => {
    // @ts-expect-errors
    axiosConfig.paramsSerializer = (params: any) => paramsSerializer(params);
    const accessTokenLocal = storage.get(AUTH_CONSTANTS.ACCESS_TOKEN);

    if (accessTokenLocal) {
      axiosConfig.headers.Authorization = accessTokenLocal;
    }

    return axiosConfig;
  },
  async (error) => await Promise.reject(error)
);
