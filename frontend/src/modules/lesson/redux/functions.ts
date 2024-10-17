import { StudentCourseResponse } from "../types/apiTypes";

export const handleConvertLessonsOfClass = (data: StudentCourseResponse[]) => {
  const classMap = new Map<
    string,
    {
      id: string;
      className: string;
      lessons: StudentCourseResponse[];
    }
  >();

  data.forEach((item) => {
    if (item.isPublished) {
      const classInfo = item.class;

      if (classInfo && !classMap.has(classInfo.id)) {
        classMap.set(classInfo.id, {
          id: classInfo.id,
          className: classInfo.className,
          lessons: [],
        });
      }

      const classData = classInfo && classMap.get(classInfo.id);
      if (classData) {
        classData.lessons.push(item);
      }
    }
  });

  return Array.from(classMap.values());
};
