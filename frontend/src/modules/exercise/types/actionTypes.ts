export type UpdateExerciseParams = {
  id: string;
  exercises: string;
  comment: string;
  point: string;
  handleSuccess?: () => void;
  handleError?: () => void;
};
