export interface GetStudentsParams {
  page: number;
  limit: number;
  search?: string;
}

export interface DeleteStudentFromClassParams {
  studentId: string;
  handleSuccess: () => void;
  handleError: () => void;
}
