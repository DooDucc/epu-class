/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiDeleteStudentFromClass,
  apiGetStudent,
  apiGetStudents,
} from "./services";
import { DeleteStudentFromClassParams, GetStudentsParams } from "../types";
import { setStudents } from "./slice";
import { COMPONENT_STAGES } from "../../base";

export const getStudents = createAsyncThunk(
  "student/getStudents",
  async (data: GetStudentsParams, { dispatch }) => {
    try {
      const response = await apiGetStudents(data);
      dispatch(
        setStudents({
          data: response?.data?.students,
          currentPage: response?.data?.currentPage,
          totalPages: response?.data?.totalPages,
          state: COMPONENT_STAGES.SUCCESS,
        })
      );
    } catch (error) {
      dispatch(
        setStudents({
          state: COMPONENT_STAGES.FAIL,
          data: [],
          totalPages: 0,
          currentPage: 1,
        })
      );
    }
  }
);

export const getStudent = createAsyncThunk(
  "student/getStudent",
  async (studentId: string, { dispatch }) => {
    try {
      dispatch(setStudents({ state: COMPONENT_STAGES.LOADING }));

      const response = await apiGetStudent(studentId);

      dispatch(
        setStudents({
          state: COMPONENT_STAGES.SUCCESS,
          currentStudent: response?.data,
        })
      );
    } catch (error) {
      dispatch(
        setStudents({
          state: COMPONENT_STAGES.FAIL,
          currentStudent: null,
        })
      );
    }
  }
);

export const deleteStudentFromClass = createAsyncThunk(
  "student/deleteStudentFromClass",
  async ({
    studentId,
    handleSuccess,
    handleError,
  }: DeleteStudentFromClassParams) => {
    try {
      await apiDeleteStudentFromClass(studentId);
      handleSuccess();
    } catch (error) {
      handleError();
    }
  }
);
