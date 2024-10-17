export interface GetStudentsAPIData {
  page: number;
  limit: number;
  search?: string;
}

export interface GetStudentsResponse {
  data: {
    students: StudentResponse[];
    currentPage: number;
    totalPages: number;
  };
}

interface UserResponse {
  fullName: string;
  avatar: string | null;
  phone: string | null;
}

interface ClassResponse {
  classCode: string;
  className: string;
}

interface CourseResponse {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    userProgress: {
      id: string;
      lessonId: string;
      studentId: string;
      isCompleted: boolean;
    }[];
  }[];
}

export interface StudentResponse {
  id: string;
  studentCode: string;
  user: UserResponse;
  classes: ClassResponse[];
  courses: CourseResponse[];
}

export interface StudentUserResponse {
  id: string;
  phone: string | null;
  fullName: string | null;
  avatar: string | null;
  isActive: boolean;
}

export interface StudentClassResponse {
  id: string;
  classCode: string;
  className: string;
  thumbnail: string;
  lessons: LessonResponse[];
}

export interface LessonResponse {
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

export interface StudentCourseResponse {
  id: string;
  title: string;
  classId: string;
  desc: string | null;
  imageUrl: string | null;
  lessons: LessonResponse[];
}

export interface GetStudentResponse {
  data: {
    id: string;
    studentCode: string;
    class: string;
    user: StudentUserResponse;
    classes: StudentClassResponse[];
    courses: StudentCourseResponse[];
  };
}
