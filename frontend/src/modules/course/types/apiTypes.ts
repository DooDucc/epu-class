export type GetCoursesAPIData = {
  page: number;
  limit: number;
  search: string;
};

export type GetCourseAPIData = {
  id: string;
};

export type GetLessonsAPIData = {
  courseId: string;
};

export type CreateCourseAPIData = {
  title: string;
  desc: string;
  isPublished: boolean;
  categoryId: string;
  teacherId: string;
  classId: string;
  imageUrl: string;
};

export type UpdateCourseAPIData = {
  id: string;
  body: {
    title?: string;
    desc?: string;
    isPublished?: boolean;
    categoryId?: string;
    teacherId?: string;
    classId?: string;
    imageUrl?: string;
  };
};

export type GetCoursesResponse = {
  data: {
    courses: CourseResponse[];
    currentPage: number;
    totalPages: number;
  };
};

export type GetCourseResponse = {
  data: CourseResponse;
};

export type CourseResponse = {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  isPublished: boolean;
  teacherId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  teacher: TeacherResponse;
  class: ClassResponse;
  lessons: any[];
  students: any[];
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
