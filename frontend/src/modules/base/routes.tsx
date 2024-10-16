import { Login, Register } from "../auth";
import { ChatPage } from "../chat";
import { CreateClass, StudentClass, TeacherClass, UpdateClass } from "../class";
import { CourseDetails, CourseReview } from "../course";
import { ExercisePage } from "../exercise";
import { HomePage } from "../home";
import {
  CreateLesson,
  StudentLesson,
  TeacherLesson,
  UpdateLesson,
} from "../lesson";
import { Profile } from "../profile";
import { ReportPage } from "../report";
import { StudentDetail, StudentsPage } from "../student";
import { PrivateRoute, PublicRoute } from "./components";

export const appPaths = {
  ROOT: "/",
  SIGN_IN: "/login",
  SIGN_UP: "/register",
  TEACHER_CLASS: "/teacher/classes",
  TEACHER_CLASS_CREATE: "/teacher/classes/create",
  TEACHER_LESSON: "/teacher/lessons",
  TEACHER_LESSON_CREATE: "/teacher/lessons/create",
  TEACHER_STUDENT: "/teacher/students",
  TEACHER_EXERCISE: "/teacher/exercises",
  TEACHER_EXERCISE_DETAIL: "/teacher/exercises/:lessonId/:exerciseId",
  TEACHER_CHAT: "/teacher/chats",
  TEACHER_REPORT: "/teacher/reports",
  STUDENT_CLASS: "/student/classes",
  STUDENT_CLASS_REVIEW: "/student/classes/:id/review",
  STUDENT_CLASS_DETAIL: "/student/classes/:id/lessons/:lessonId",
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
    path: `${appPaths.TEACHER_CHAT}/lesson/:lessonId/student/:studentId`,
    element: <ChatPage />,
  },
  {
    path: appPaths.TEACHER_REPORT,
    element: <ReportPage />,
  },
  {
    path: appPaths.STUDENT_CLASS,
    element: <StudentClass />,
  },
  {
    path: `${appPaths.STUDENT_CLASS}/:id`,
    element: <CourseDetails />,
  },
  {
    path: appPaths.STUDENT_CLASS_REVIEW,
    element: <CourseReview />,
  },
  {
    path: `${appPaths.STUDENT_CLASS}/:id/lessons/:lessonId`,
    element: <CourseDetails />,
  },
  {
    path: appPaths.STUDENT_LESSON,
    element: <StudentLesson />,
  },
  {
    path: `${appPaths.STUDENT_LESSON}/:classId`,
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
