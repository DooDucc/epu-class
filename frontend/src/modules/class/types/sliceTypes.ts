export type ClassState = {
  class: {
    data: Class[];
    updatingClass: Class | null;
    state: string;
    currentPage: number;
    totalPages: number;
    searchTerm: string;
  };
  createClass: {
    lessons: Lesson[];
    thumbnail: string;
    uploadState: string;
  };
};

export type Student = {
  id: string;
  studentCode: string;
  password: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Class = {
  id: string;
  classCode: string;
  className: string;
  desc: string;
  thumbnail: string;
  isPublished: boolean;
  majorId: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  teacher: Teacher;
  lessons: Lesson[];
  students: Student[];
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

export type UserProgress = {
  id: string;
  isCompleted: boolean;
  lessonId: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
};

export type Exercise = {
  id: string;
  name: string;
  url: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: string;
  title: string;
  desc: string;
  position: number;
  isPublished: boolean;
  videoUrl: string;
  videoDuration: number;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  userProgress: UserProgress[];
  exercises: Exercise[];
  attachments: Attachment[];
  note?: any;
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
  lessons?: Lesson[];
};
