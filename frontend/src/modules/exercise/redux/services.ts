import { authorizedApi } from "../../base";
import {
  GetSubmittedExerciseResponse,
  GetSubmittedExercisesResponse,
  UpdateExerciseParams,
} from "../types";

export const apiGetSubmittedExercises =
  (): Promise<GetSubmittedExercisesResponse> => {
    return authorizedApi.get(`/exercises`);
  };

export const apiGetSubmittedExerciseById = (
  id: string
): Promise<GetSubmittedExerciseResponse> => {
  return authorizedApi.get(`/exercises/${id}`);
};

export const apiUpdateExercise = (data: UpdateExerciseParams) => {
  return authorizedApi.put(`/exercises/${data.id}`, {
    exercises: data.exercises,
    comment: data.comment,
    point: data.point,
  });
};
