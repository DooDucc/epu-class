import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetProfile, apiLogin, apiRegister } from "./services";
import { AUTH_CONSTANTS, COMPONENT_STAGES } from "../../base/utils";
import { storage } from "../../base/helpers/storage";
import { setAuthState, setUserInfo } from "./slice";
import { LoginParams, ProfileParams } from "../types";

export const login = createAsyncThunk(
  "auth/login",
  async (
    { studentCode, email, password, handleSuccess, handleError }: LoginParams,
    { dispatch }
  ) => {
    try {
      let res;
      if (studentCode) {
        res = await apiLogin({ studentCode, password });
      } else {
        res = await apiLogin({ email, password });
      }

      storage.set(AUTH_CONSTANTS.ACCESS_TOKEN, res?.data?.token);
      dispatch(setAuthState(COMPONENT_STAGES.SUCCESS));
      handleSuccess?.();
    } catch (err: any) {
      dispatch(setAuthState(COMPONENT_STAGES.FAIL));
      handleError?.(err.response?.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      studentCode,
      email,
      password,
      fullName,
      phone,
      className,
      handleSuccess,
      handleError,
    }: LoginParams,
    { dispatch }
  ) => {
    try {
      let res;
      if (studentCode) {
        res = await apiRegister({
          studentCode,
          password,
          fullName,
          phone,
          className,
        });
      } else {
        res = await apiRegister({ email, password, fullName, phone });
      }

      storage.set(AUTH_CONSTANTS.ACCESS_TOKEN, res?.data?.token);
      dispatch(setAuthState(COMPONENT_STAGES.SUCCESS));
      handleSuccess?.();
    } catch (err: any) {
      dispatch(setAuthState(COMPONENT_STAGES.FAIL));
      handleError?.(err.response?.data);
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async ({ handleSuccess, handleError }: ProfileParams, { dispatch }) => {
    try {
      const res = await apiGetProfile();
      dispatch(setUserInfo(res?.data));
      dispatch(setAuthState(COMPONENT_STAGES.SUCCESS));
      handleSuccess?.();
    } catch (error) {
      dispatch(setAuthState(COMPONENT_STAGES.FAIL));
      handleError?.();
    }
  }
);
