export type CreateCourseParams = {
  title: string;
  desc: string;
  isPublished: boolean;
  teacherId: string;
  classId: string;
  imageUrl: string;
  handleSuccess: (id: string) => void;
};

export type GetCoursesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type GetCourseParams = {
  id: string;
};

export type DeleteCourseParams = {
  id: string;
  handleSuccess: () => void;
  handleFail: () => void;
};

export type UpdateCourseParams = {
  id: string;
  title?: string;
  desc?: string;
  isPublished?: boolean;
  teacherId?: string;
  classId?: string;
  imageUrl?: string;
  handleSuccess: () => void;
  handleFail: () => void;
};

export type GetLessonsParams = {
  courseId: string;
};

export type UpdateLessonPositionsParams = {
  courseId: string;
  lessons: { id: string; position: number }[];
  handleSuccess: () => void;
  handleFail: () => void;
};

export type RegisterCourseParams = {
  id: string;
  body: {
    userId: string;
  };
  handleSuccess: () => void;
  handleFail: () => void;
};

export type UpdateLessonProgressParams = {
  lessonId: string;
  studentId: string;
  isCompleted: boolean;
};

export type GetNoteParams = {
  lessonId: string;
  studentId: string;
};

export type UpdateNoteParams = {
  lessonId: string;
  studentId: string;
  content: string;
  handleSuccess?: () => void;
  handleFail?: () => void;
};

export type GetSubmittedExerciseParams = {
  lessonId: string;
  studentId: string;
};

export type SubmitExerciseParams = {
  lessonId: string;
  studentId: string;
  teacherId: string;
  exercises: {
    name: string;
    url: string;
    type: string;
  }[];
  handleSuccess: () => void;
  handleFail: () => void;
};
