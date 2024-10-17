export type CreateClassesParams = {
  classCode: string;
  className: string;
  desc?: string;
  isPublished: boolean;
  thumbnailUrl: string;
  teacherId: string;
  handleSuccess: (id: string) => void;
};

export type UpdateClassesParams = {
  id: string;
  classCode?: string;
  className?: string;
  desc?: string;
  isPublished?: boolean;
  thumbnailUrl?: string;
  teacherId?: string;
  handleSuccess: () => void;
  handleFail: () => void;
};

export type DeleteClassParams = {
  id: string;
  handleSuccess: () => void;
  handleFail: () => void;
};

export type GetClassesParams = {
  page?: number;
  limit?: number;
  search?: string;
  majorId?: string;
  isLoading?: boolean;
};

export type GetClassParams = {
  id: string;
  isStudent?: boolean;
};

export type UploadParams = {
  file: any;
  handleSuccess: (url: string) => void;
  handleUploading: () => void;
  handleFail: () => void;
};

export type JoinClassParams = {
  classCode: string;
  userId: string;
  handleSuccess: () => void;
  handleFail: (errorMessage: string) => void;
};

export type UpdateLessonPositionsParams = {
  classId: string;
  lessons: { id: string; position: number }[];
  handleSuccess: () => void;
  handleFail: () => void;
};
