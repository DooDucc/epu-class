import { prismaClient } from "./index";

async function main() {
  try {
    // Create Users for Teachers
    await prismaClient.user.createMany({
      data: [
        {
          fullName: "Teacher One",
          isActive: true,
          avatar:
            "https://fastly.picsum.photos/id/1065/200/300.jpg?hmac=WvioY_uR2xNPKNxQoR9y1HhWkuV6_v7rB23clZYh0Ks",
          phone: "123-456-7890",
        },
        {
          fullName: "Teacher Two",
          isActive: true,
          avatar:
            "https://fastly.picsum.photos/id/174/200/300.jpg?hmac=QaIDLHcDtfSD0nDbTHmEYRm7_bAbvyCafyheoeR2ZB4",
          phone: "987-654-3210",
        },
        {
          fullName: "Student One",
          isActive: true,
          avatar:
            "https://fastly.picsum.photos/id/1065/200/300.jpg?hmac=WvioY_uR2xNPKNxQoR9y1HhWkuV6_v7rB23clZYh0Ks",
          phone: "0123193912",
        },
        {
          fullName: "Student Two",
          isActive: true,
          avatar:
            "https://fastly.picsum.photos/id/174/200/300.jpg?hmac=QaIDLHcDtfSD0nDbTHmEYRm7_bAbvyCafyheoeR2ZB4",
          phone: "838383833",
        },
      ],
    });

    // Create Teachers
    await prismaClient.teacher.createMany({
      data: [
        {
          email: "teacher1@example.com",
          password: "password1",
          userId: (
            await prismaClient.user.findFirst({
              where: { fullName: "Teacher One" },
            })
          )?.id,
        },
        {
          email: "teacher2@example.com",
          password: "password2",
          userId: (
            await prismaClient.user.findFirst({
              where: { fullName: "Teacher Two" },
            })
          )?.id,
        },
      ],
    });

    // Create Students
    await prismaClient.student.createMany({
      data: [
        {
          studentCode: "S001",
          password: "password1",
          userId: (
            await prismaClient.user.findFirst({
              where: { fullName: "Student One" },
            })
          )?.id,
        },
        {
          studentCode: "S002",
          password: "password2",
          userId: (
            await prismaClient.user.findFirst({
              where: { fullName: "Student Two" },
            })
          )?.id,
        },
      ],
    });

    // Create Majors
    await prismaClient.major.createMany({
      data: [
        { name: "Computer Engineering" },
        { name: "Music Production" },
        { name: "Sports Science" },
      ],
    });

    // Get a random teacher
    const randomTeacher = await prismaClient.teacher.findFirst({
      select: { userId: true },
    });

    if (!randomTeacher) {
      console.log("No teachers found. Please create a teacher first.");
      return;
    }

    // Create Classes
    await prismaClient.class.createMany({
      data: [
        {
          classCode: "CS101",
          className: "Introduction to Programming",
          thumbnail: "https://example.com/cs101-thumbnail.jpg",
          majorId: (
            await prismaClient.major.findFirst({
              where: { name: "Computer Engineering" },
            })
          )?.id,
          teacherId: randomTeacher.userId,
        },
        {
          classCode: "MUS201",
          className: "Digital Audio Workstations",
          thumbnail: "https://example.com/mus201-thumbnail.jpg",
          majorId: (
            await prismaClient.major.findFirst({
              where: { name: "Music Production" },
            })
          )?.id,
          teacherId: randomTeacher.userId,
        },
        {
          classCode: "FIT301",
          className: "Exercise Physiology",
          thumbnail: "https://example.com/fit301-thumbnail.jpg",
          majorId: (
            await prismaClient.major.findFirst({
              where: { name: "Sports Science" },
            })
          )?.id,
          teacherId: randomTeacher.userId,
        },
      ],
    });

    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prismaClient.$disconnect();
  }
}

main();
