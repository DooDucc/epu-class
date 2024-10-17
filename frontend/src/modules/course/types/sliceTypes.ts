/* eslint-disable @typescript-eslint/no-explicit-any */
import { Class } from "../../class/types";

export type CourseState = {
  course: {
    data: Course[];
    updatingCourse: Course | null;
    state: string;
    currentPage: number;
    totalPages: number;
    searchTerm: string;
  };
  courseDetails: {
    note: string;
    submittedExercise: SubmittedExerciseType | null;
  };
  createCourse: {
    classes: Class[];
    lessons: LessonType[];
    thumbnail: string;
    uploadState: string;
  };
};

export type SubmittedExerciseType = {
  id: string;
  exercises: string;
  lessonId: string;
  studentId: string;
  teacherId: string;
  comment: string;
  point: string;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  isPublished: boolean;
  teacherId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  classCode: string;
  className: string;
  lessons: LessonType[];
  students: any[];
};

export type ClassType = {
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

export type Teacher = {
  id: string;
  phone: string;
  fullName: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LessonType = {
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
  userProgress?: UserProgressType[];
  attachments?: AttachmentType[];
  note?: any;
  exercises?: ExerciseType[];
};

export type CourseType = {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  isPublished: boolean;
  teacherId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
};

export type AttachmentType = {
  id?: string;
  name: string;
  url: string;
  lessonId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ExerciseType = {
  id?: string;
  name: string;
  url: string;
  lessonId?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string | null;
};

export type UserProgressType = {
  id: string;
  isCompleted: boolean;
  lessonId: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
};
