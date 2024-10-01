export type ClassResponse = {
  id: string;
  className: string;
};

export type CourseResponse = {
  id: string;
  title: string;
  classId: string;
  class: ClassResponse;
};

export type LessonResponse = {
  id: string;
  title: string;
  courseId: string;
  course: CourseResponse;
};

export type ExerciseResponse = {
  id: string;
  exercises: string;
  lessonId: string;
  studentId: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  studentFullName: string;
  studentAvatar: string;
  comment: string;
  point: string;
  lesson: LessonResponse;
};

export type GetSubmittedExercisesResponse = {
  data: ExerciseResponse[];
};

export type GetSubmittedExerciseResponse = {
  data: ExerciseResponse;
};
