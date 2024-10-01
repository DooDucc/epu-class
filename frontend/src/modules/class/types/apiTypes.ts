export type GetClassesAPIData = {
  page: number;
  limit: number;
  search: string;
  majorId?: string;
};

export type GetClassAPIData = {
  id: string;
};

export type CreateClassAPIData = {
  classCode: string;
  className: string;
  isPublished: boolean;
  majorId: string;
  teacherId: string;
  thumbnailUrl: string;
};

export type UpdateClassAPIData = {
  id: string;
  body: {
    classCode?: string;
    className?: string;
    isPublished?: boolean;
    majorId?: string;
    teacherId?: string;
    thumbnailUrl?: string;
  };
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
  major: {
    id: string;
    name: string;
  };
  teacher: TeacherResponse;
  courses: any[]; // You might want to define a more specific type for courses
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

export type MajorResponse = {
  data: {
    id: string;
    name: string;
  }[];
};
