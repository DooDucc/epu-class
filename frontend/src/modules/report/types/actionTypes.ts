export type GetStudentsByClassParams = {
  classId: string;
  year: number;
};

export type GetStudentsByCourseParams = {
  courseId: string;
  year: number;
};

export type GetSubmittedExerciseStatsParams = {
  lessonId: string;
};

export type GetCourseExerciseStatsParams = {
  courseId: string;
};

export type GetClassExerciseStatsParams = {
  classId: string;
};
