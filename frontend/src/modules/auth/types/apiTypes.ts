export type LoginAPIData = {
  studentCode?: string;
  email?: string;
  password: string;
};

export type LoginResponse = {
  data: {
    token: string;
    role: string;
  };
};

export type ProfileResponse = {
  data: {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
};
