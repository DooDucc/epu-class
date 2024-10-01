export type LoginParams = {
  studentCode: string;
  email: string;
  password: string;
  handleSuccess: () => void;
  handleError: (errorMessage: string) => void;
};

export type ProfileParams = {
  handleSuccess?: () => void;
  handleError?: () => void;
};
