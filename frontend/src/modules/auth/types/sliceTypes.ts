export type AuthState = {
  user: User | null;
  authState: string;
};

export type User = {
  id: string;
  userId: string;
  phone: string;
  fullName: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
};
