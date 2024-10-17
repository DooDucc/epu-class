export type ChatState = {
  chat: {
    data: ChatType[];
    currentChat: ChatType | null;
    state: string;
    currentPage: number;
    totalPages: number;
  };
};

export type MessageType = {
  id: string;
  content: string;
  chatId: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    fullName: string;
    avatar: string;
  };
};

export type ClassType = {
  id: string;
  className: string;
};

export type LessonType = {
  id: string;
  title: string;
  class: ClassType;
  videoUrl: string;
  attachments: AttachmentType[];
  exercises: ExerciseType[];
  desc: string;
  updatedAt: string;
};

export type StudentType = {
  user: {
    fullName: string;
    avatar: string;
  };
};

export type ChatType = {
  id: string;
  lessonId: string;
  studentId: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  lesson: LessonType;
  student: StudentType;
  messages: MessageType[];
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
