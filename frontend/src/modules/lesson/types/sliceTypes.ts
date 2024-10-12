/* eslint-disable @typescript-eslint/no-explicit-any */
export type LessonState = {
  lesson: {
    data: LessonType[];
    updatingLesson: LessonType | null;
    state: string;
    currentPage: number;
    totalPages: number;
    searchTerm: string;
  };
  createLesson: {
    courses: CourseType[];
    videoUrl: string;
    attachments: { name: string; url: string; type?: string }[];
    exercises: { name: string; url: string; type?: string }[];
    uploadState: {
      video: string;
      attachment: string;
      exercise: string;
    };
  };
  studentCourse: {
    data: StudentCourse[];
  };
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
  courseName: string;
  createdAt: string;
  updatedAt: string;
  course: CourseType;
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

export type StudentLessonType = {
  id: string;
  title: string;
  desc: string;
  position: number;
  isPublished: boolean;
  videoUrl: string;
  videoDuration: number;
  userProgress: UserProgressType[];
  courseId: string;
};

export type StudentCourseType = {
  id: string;
  title: string;
  classId: string;
  lessons: StudentLessonType[];
};

export type StudentCourse = {
  id: string;
  className: string;
  courses: StudentCourseType[];
};
