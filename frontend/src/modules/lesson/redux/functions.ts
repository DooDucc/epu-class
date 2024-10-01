import { StudentLessonResponse } from "../types";

export const handleConvertLessons = (data: StudentLessonResponse[]) => {
  const classMap = new Map();

  data.forEach((item) => {
    const classInfo = item.course.class;
    const courseInfo = item.course;
    const lessonInfo = {
      id: item.id,
      title: item.title,
      desc: item.desc,
      position: item.position,
      isPublished: item.isPublished,
      videoUrl: item.videoUrl,
      videoDuration: item.videoDuration,
      userProgress: item.userProgress,
      courseId: item.courseId,
    };

    if (classInfo && !classMap.has(classInfo.id)) {
      classMap.set(classInfo.id, {
        id: classInfo.id,
        className: classInfo.className,
        courses: new Map(),
      });
    }

    const classData = classInfo && classMap.get(classInfo.id);
    if (classData && courseInfo && !classData.courses.has(courseInfo.id)) {
      classData.courses.set(courseInfo.id, {
        id: courseInfo.id,
        title: courseInfo.title,
        classId: courseInfo.classId,
        lessons: [],
      });
    }

    classData.courses.get(courseInfo.id).lessons.push(lessonInfo);
  });

  return Array.from(classMap.values()).map((classData) => ({
    ...classData,
    courses: Array.from(classData.courses.values()),
  }));
};
