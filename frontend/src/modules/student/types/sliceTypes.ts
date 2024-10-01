export interface StudentState {
  student: {
    data: Student[];
    currentStudent: StudentDetail | null;
    state: string;
    currentPage: number;
    totalPages: number;
  };
}

interface User {
  fullName: string;
  avatar: string | null;
  phone: string | null;
}

interface Class {
  classCode: string;
  className: string;
}

export interface Student {
  id: string;
  studentCode: string;
  user: User;
  classes: Class[];
}

export interface StudentDetailUser {
  id: string;
  phone: string | null;
  fullName: string | null;
  avatar: string | null;
  isActive: boolean;
}

export interface StudentDetailClass {
  id: string;
  classCode: string;
  className: string;
  thumbnail: string;
}

export interface StudentDetailLesson {
  id: string;
  title: string;
  desc: string | null;
  position: number;
  isPublished: boolean;
  videoUrl: string | null;
  videoDuration: number;
  userProgress: any[]; // You might want to define a more specific type for userProgress
  isCompleted: boolean;
}

export interface StudentDetailCourse {
  id: string;
  title: string;
  classId: string;
  desc: string | null;
  imageUrl: string | null;
  lessons: StudentDetailLesson[];
}

export interface StudentDetail {
  id: string;
  studentCode: string;
  user: StudentDetailUser;
  classes: StudentDetailClass[];
  courses: StudentDetailCourse[];
}
