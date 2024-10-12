/* eslint-disable @typescript-eslint/no-explicit-any */
export type GetLessonsAPIData = {
  page: number;
  limit: number;
  search: string;
};

export type GetLessonAPIData = {
  id: string;
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

export type GetLessonsResponse = {
  data: {
    lessons: LessonResponse[];
    currentPage: number;
    totalPages: number;
  };
};

export type GetLessonResponse = {
  data: LessonResponse;
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
  course: CourseResponse;
  attachments: any[];
  exercises: any[];
};

export type ClassResponse = {
  id: string;
  className: string;
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
  class?: ClassResponse;
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

export type UserProgressResponse = {
  id: string;
  isCompleted: boolean;
  lessonId: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentCourseResponse = {
  id: string;
  title: string;
  desc: string;
  position: number;
  isPublished: boolean;
  videoUrl: string;
  videoDuration: number;
  courseId: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  userProgress: UserProgressResponse[];
  course: CourseResponse;
};

export type GetStudentCoursesResponse = {
  data: {
    lessons: StudentCourseResponse[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
};
