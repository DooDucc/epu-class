import { Login, Register } from "../auth";
import { ChatPage } from "../chat";
import {
  ClassDetails,
  CreateClass,
  StudentClass,
  TeacherClass,
  UpdateClass,
} from "../class";
import {
  CourseDetails,
  CourseReview,
  CreateCourse,
  TeacherCourse,
  UpdateCourse,
} from "../course";
import { ExercisePage } from "../exercise";
import { HomePage } from "../home";
import {
  CreateLesson,
  StudentLesson,
  TeacherLesson,
  UpdateLesson,
} from "../lesson";
import { Profile } from "../profile";
import { StudentDetail, StudentsPage } from "../student";
import { PrivateRoute, PublicRoute } from "./components";

export const appPaths = {
  ROOT: "/",
  SIGN_IN: "/login",
  SIGN_UP: "/register",
  TEACHER_CLASS: "/teacher/classes",
  TEACHER_CLASS_CREATE: "/teacher/classes/create",
  TEACHER_SUBJECT: "/teacher/subjects",
  TEACHER_SUBJECT_CREATE: "/teacher/subjects/create",
  TEACHER_LESSON: "/teacher/lessons",
  TEACHER_LESSON_CREATE: "/teacher/lessons/create",
  TEACHER_STUDENT: "/teacher/students",
  TEACHER_EXERCISE: "/teacher/exercises",
  TEACHER_EXERCISE_DETAIL: "/teacher/exercises/:lessonId/:exerciseId",
  TEACHER_CHAT: "/teacher/chats",
  TEACHER_REPORT: "/teacher/reports",
  STUDENT_CLASS: "/student/classes",
  STUDENT_COURSE: "/student/courses",
  STUDENT_COURSE_REVIEW: "/student/courses/:id/review",
  STUDENT_COURSE_LESSON: "/student/courses/:id/lessons/:lessonId",
  STUDENT_LESSON: "/student/lessons",
  PROFILE: "/profile",
};

export const privateRoutes = [
  {
    path: appPaths.ROOT,
    element: <HomePage />,
  },
  {
    path: appPaths.TEACHER_CLASS,
    element: <TeacherClass />,
  },
  {
    path: appPaths.TEACHER_CLASS_CREATE,
    element: <CreateClass />,
  },
  {
    path: `${appPaths.TEACHER_CLASS}/:id`,
    element: <UpdateClass />,
  },
  {
    path: appPaths.TEACHER_SUBJECT,
    element: <TeacherCourse />,
  },
  {
    path: appPaths.TEACHER_SUBJECT_CREATE,
    element: <CreateCourse />,
  },
  {
    path: `${appPaths.TEACHER_SUBJECT}/:id`,
    element: <UpdateCourse />,
  },
  {
    path: appPaths.TEACHER_LESSON,
    element: <TeacherLesson />,
  },
  {
    path: appPaths.TEACHER_LESSON_CREATE,
    element: <CreateLesson />,
  },
  {
    path: `${appPaths.TEACHER_LESSON}/:id`,
    element: <UpdateLesson />,
  },
  {
    path: appPaths.TEACHER_STUDENT,
    element: <StudentsPage />,
  },
  {
    path: `${appPaths.TEACHER_STUDENT}/:id`,
    element: <StudentDetail />,
  },
  {
    path: appPaths.TEACHER_EXERCISE,
    element: <ExercisePage />,
  },
  {
    path: `${appPaths.TEACHER_EXERCISE}/:lessonId`,
    element: <ExercisePage />,
  },
  {
    path: appPaths.TEACHER_CHAT,
    element: <ChatPage />,
  },
  {
    path: `${appPaths.TEACHER_CHAT}/lesson/:lessonId`,
    element: <ChatPage />,
  },
  {
    path: appPaths.TEACHER_REPORT,
    element: <HomePage />,
  },
  {
    path: appPaths.STUDENT_CLASS,
    element: <StudentClass />,
  },
  {
    path: `${appPaths.STUDENT_CLASS}/:id`,
    element: <ClassDetails />,
  },
  {
    path: appPaths.STUDENT_COURSE_REVIEW,
    element: <CourseReview />,
  },
  {
    path: `${appPaths.STUDENT_COURSE}/:id`,
    element: <CourseDetails />,
  },
  {
    path: `${appPaths.STUDENT_COURSE}/:id/lessons/:lessonId`,
    element: <CourseDetails />,
  },
  {
    path: appPaths.STUDENT_LESSON,
    element: <StudentLesson />,
  },
  {
    path: appPaths.PROFILE,
    element: <Profile />,
  },
];

export const authRoutes = [
  {
    path: appPaths.SIGN_IN,
    element: <Login />,
  },
  {
    path: appPaths.SIGN_UP,
    element: <Register />,
  },
];

export const routes = [
  {
    element: <PrivateRoute />,
    children: privateRoutes,
  },
  {
    element: <PublicRoute />,
    children: authRoutes,
  },
];
