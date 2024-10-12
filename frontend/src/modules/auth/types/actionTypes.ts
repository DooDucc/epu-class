export type LoginParams = {
  studentCode: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  className: string;
  handleSuccess: () => void;
  handleError: (errorMessage: string) => void;
};

export type ProfileParams = {
  handleSuccess?: () => void;
  handleError?: () => void;
};
