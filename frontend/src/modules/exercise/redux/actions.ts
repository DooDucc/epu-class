/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetSubmittedExerciseById,
  apiGetSubmittedExercises,
  apiUpdateExercise,
} from "./services";
import { setSubmittedExercises } from "./slice";
import { COMPONENT_STAGES } from "../../base";
import { handleConvertExercises } from "./functions";
import { UpdateExerciseParams } from "../types";

export const getSubmittedExercises = createAsyncThunk(
  "exercise/getSubmittedExercises",
  async (_, { dispatch }) => {
    try {
      dispatch(
        setSubmittedExercises({
          state: COMPONENT_STAGES.LOADING,
        })
      );

      const response = await apiGetSubmittedExercises();
      if (response?.data?.length > 0) {
        const modifiedData = handleConvertExercises(response.data);
        dispatch(
          setSubmittedExercises({
            data: modifiedData,
            state: COMPONENT_STAGES.LOADING,
          })
        );
      }
    } catch (error) {
      dispatch(
        setSubmittedExercises({
          data: [],
          state: COMPONENT_STAGES.FAIL,
        })
      );
    }
  }
);

export const getSubmittedExerciseById = createAsyncThunk(
  "exercise/getSubmittedExerciseById",
  async (id: string, { dispatch }) => {
    try {
      const response = await apiGetSubmittedExerciseById(id);

      const { lesson, ...rest } = response.data;

      dispatch(
        setSubmittedExercises({
          updatingExercise: rest,
        })
      );
    } catch (error) {
      dispatch(
        setSubmittedExercises({
          updatingExercise: null,
        })
      );
    }
  }
);

export const updateExercise = createAsyncThunk(
  "exercise/updateExercise",
  async (
    {
      id,
      exercises,
      comment,
      point,
      handleSuccess,
      handleError,
    }: UpdateExerciseParams,
    { dispatch }
  ) => {
    try {
      await apiUpdateExercise({ id, exercises, comment, point });
      dispatch(getSubmittedExercises());
      handleSuccess?.();
    } catch (error) {
      handleError?.();
    }
  }
);
