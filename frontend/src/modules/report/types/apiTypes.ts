export type AmountOfStudentsResponse = {
  month: number;
  studentCount: number;
};

export type StudentByClassResponse = {
  data: AmountOfStudentsResponse[];
};

export type StudentByCourseResponse = {
  data: AmountOfStudentsResponse[];
};

export type PercentagesResponse = {
  lowRange: number;
  midRange: number;
  highRange: number;
};

export type ClassExerciseStatsResponse = {
  data: {
    totalSubmissions: number;
    percentages: PercentagesResponse;
  };
};

export type CourseExerciseStatsResponse = ClassExerciseStatsResponse;

export type ClassResponse = {
  id: string;
  classCode: string;
  className: string;
  thumbnail: string;
  majorId: string;
};

export type CourseResponse = {
  id: string;
  title: string;
  imageUrl: string;
  classId: string;
};

export type ClassesResponse = {
  data: {
    classes: ClassResponse[];
  };
};

export type CoursesResponse = {
  data: {
    courses: CourseResponse[];
  };
};

export type TotalInfoResponse = {
  data: {
    classCount: number;
    courseCount: number;
    lessonCount: number;
    studentCount: number;
  };
};
