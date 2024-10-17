export type AmountOfStudentsResponse = {
  month: number;
  studentCount: number;
};

export type StudentByClassResponse = {
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

export type ClassResponse = {
  id: string;
  classCode: string;
  className: string;
  thumbnail: string;
  majorId: string;
};

export type ClassesResponse = {
  data: {
    classes: ClassResponse[];
  };
};

export type TotalInfoResponse = {
  data: {
    classCount: number;
    lessonCount: number;
    studentCount: number;
  };
};

export type StudentResponse = {
  id: string;
  studentCode: string;
  fullName: string;
  avatar: string;
  percentage: number;
  count: number;
};

export type TopStudentsResponse = {
  data: StudentResponse[];
};
