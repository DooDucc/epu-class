export type CreateLessonParams = {
  title: string;
  desc?: string;
  isPublished?: boolean;
  videoUrl?: string;
  videoDuration?: number;
  courseId: string;
  exercises?: { name: string; url: string }[];
  attachments?: { name: string; url: string }[];
  handleSuccess: () => void;
  handleFail: () => void;
};

export type GetLessonsParams = {
  page?: number;
  limit?: number;
  search?: string;
  isLoading?: boolean;
};

export type GetLessonParams = {
  id: string;
};

export type DeleteLessonParams = {
  id: string;
  handleSuccess: () => void;
  handleFail: () => void;
};

export type UpdateLessonParams = {
  id: string;
  title?: string;
  desc?: string;
  position?: number;
  isPublished?: boolean;
  videoUrl?: string;
  videoDuration?: number;
  courseId?: string;
  notes?: { content: string; studentId: string }[];
  handleSuccess: () => void;
  handleFail: () => void;
};

export type GetStudentLessonsParams = {
  studentId: string;
};
