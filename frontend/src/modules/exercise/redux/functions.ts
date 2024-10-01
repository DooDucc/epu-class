/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseResponse, ExerciseResponse, LessonResponse } from "../types";

export const handleConvertExercises = (data: ExerciseResponse[]) => {
  const groupedData = data.reduce((acc, item) => {
    const classInfo = item.lesson.course.class;
    const courseInfo = item.lesson.course;
    const lessonInfo = item.lesson;

    // Check if class exists
    if (!acc[classInfo.id]) {
      acc[classInfo.id] = {
        id: classInfo.id,
        className: classInfo.className,
        courses: [],
      };
    }

    // Find or create course
    let course = acc[classInfo.id].courses.find(
      (c: CourseResponse) => c.id === courseInfo.id
    );
    if (!course) {
      course = {
        id: courseInfo.id,
        title: courseInfo.title,
        classId: courseInfo.classId,
        lessons: [],
      };
      acc[classInfo.id].courses.push(course);
    }

    // Find or create lesson
    let lesson = course.lessons.find(
      (l: LessonResponse) => l.id === lessonInfo.id
    );
    if (!lesson) {
      lesson = {
        id: lessonInfo.id,
        title: lessonInfo.title,
        courseId: lessonInfo.courseId,
        exercisesSubmitted: [],
      };
      course.lessons.push(lesson);
    }

    // Add exercise submission
    lesson.exercisesSubmitted.push({
      id: item.id,
      exercises: item.exercises,
      lessonId: item.lessonId,
      studentId: item.studentId,
      teacherId: item.teacherId,
      studentFullName: item.studentFullName,
      studentAvatar: item.studentAvatar,
      point: item.point,
      comment: item.comment,
    });

    return acc;
  }, {} as Record<string, any>);

  return Object.values(groupedData);
};
