export type ReportState = {
  studentsByClass: {
    data: AmountOfStudents[];
    state: string;
  };
  lessonExerciseStats: {
    data: LessonExerciseStats;
    state: string;
  };
  classExerciseStats: {
    data: ClassExerciseStats;
    state: string;
  };
  classes: {
    data: Class[];
    state: string;
  };
  lessons: {
    data: { id: string; title: string }[];
    state: string;
  };
  totalInfo: {
    data: TotalInfo;
    state: string;
  };
  topStudentsByClass: {
    data: TopStudent[];
    state: string;
  };
};

export type AmountOfStudents = {
  month: number;
  studentCount: number;
};

export type Percentages = {
  lowRange: number;
  midRange: number;
  highRange: number;
};

export type ClassExerciseStats = {
  totalSubmissions: number;
  percentages: Percentages;
};

export type LessonExerciseStats = ClassExerciseStats;

export type Class = {
  id: string;
  classCode: string;
  className: string;
  thumbnail: string;
  majorId: string;
};

export type TotalInfo = {
  classCount: number;
  lessonCount: number;
  studentCount: number;
};

export type TopStudent = {
  id: string;
  studentCode: string;
  fullName: string;
  avatar: string;
  percentage: number;
  count: number;
};
