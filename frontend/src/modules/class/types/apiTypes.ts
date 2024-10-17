export type GetClassesAPIData = {
  page: number;
  limit: number;
  search: string;
};

export type GetClassAPIData = {
  id: string;
};

export type CreateClassAPIData = {
  classCode: string;
  className: string;
  isPublished: boolean;
  teacherId: string;
  thumbnailUrl: string;
  desc?: string;
};

export type UpdateClassAPIData = {
  id: string;
  body: {
    classCode?: string;
    className?: string;
    isPublished?: boolean;
    desc?: string;
    teacherId?: string;
    thumbnailUrl?: string;
  };
};

export type GetLessonsAPIData = {
  classId: string;
};

export type GetClassesResponse = {
  data: {
    classes: ClassResponse[];
    currentPage: number;
    totalPages: number;
  };
};

export type GetClassResponse = {
  data: ClassResponse;
};

export type ClassResponse = {
  id: string;
  classCode: string;
  className: string;
  thumbnail: string;
  isPublished: boolean;
  majorId: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  desc: string;
  teacher: TeacherResponse;
  lessons: any[]; // You might want to define a more specific type for courses
  students: any[]; // You might want to define a more specific type for students
};

export type TeacherResponse = {
  id: string;
  phone: string;
  fullName: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetLessonsResponse = {
  data: {
    lessons: LessonResponse[];
    currentPage: number;
    totalPages: number;
  };
};

export type LessonResponse = {
  id: string;
  title: string;
  desc: string;
  position: number;
  isPublished: boolean;
  videoUrl: string;
  videoDuration: number;
  courseId: string;
  teacherId: string;
  courseName: string;
  createdAt: string;
  updatedAt: string;
  teacher: TeacherResponse;
  attachments: any[];
  exercises: any[];
};
