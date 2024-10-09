export type ReportState = {
  studentsByClass: {
    data: AmountOfStudents[];
    state: string;
  };
  studentsByCourse: {
    data: AmountOfStudents[];
    state: string;
  };
  submittedExerciseStats: {
    data: [];
    state: string;
  };
  courseExerciseStats: {
    data: CourseExerciseStats;
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
  courses: {
    data: Course[];
    state: string;
  };
  lessons: {
    data: any[];
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

export type CourseExerciseStats = ClassExerciseStats;

export type Class = {
  id: string;
  classCode: string;
  className: string;
  thumbnail: string;
  majorId: string;
};

export type Course = {
  id: string;
  title: string;
  imageUrl: string;
  classId: string;
};
