/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExerciseResponse, LessonResponse } from "../types";

export const handleConvertExercises = (data: ExerciseResponse[]) => {
  const groupedData = data.reduce((acc, item) => {
    const classInfo = item.lesson.class;
    const lessonInfo = item.lesson;

    // Check if class exists
    if (!acc[classInfo.id]) {
      acc[classInfo.id] = {
        id: classInfo.id,
        className: classInfo.className,
        lessons: [],
      };
    }

    // Find or create lesson
    let lesson = acc[classInfo.id].lessons.find(
      (l: LessonResponse) => l.id === lessonInfo.id
    );
    if (!lesson) {
      lesson = {
        id: lessonInfo.id,
        title: lessonInfo.title,
        classId: lessonInfo.classId,
        exercisesSubmitted: [],
      };
      acc[classInfo.id].lessons.push(lesson);
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
