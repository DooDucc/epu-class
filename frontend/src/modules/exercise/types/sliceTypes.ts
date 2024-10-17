export type ExerciseState = {
  exercise: {
    data: Exercise[];
    updatingExercise: ExerciseItem | null;
    state: string;
    currentPage: number;
    totalPages: number;
  };
};

export type ExerciseItem = {
  id: string;
  exercises: string;
  lessonId: string;
  studentId: string;
  teacherId: string;
  studentFullName: string;
  studentAvatar: string;
  comment: string;
  point: string;
};

export type Lesson = {
  id: string;
  title: string;
  courseId: string;
  exercisesSubmitted: ExerciseItem[];
};

export type Exercise = {
  id: string;
  className: string;
  lessons: Lesson[];
};
