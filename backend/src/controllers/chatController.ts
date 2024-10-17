import { Server, Socket } from "socket.io";
import { prismaClient } from "..";
import { ROLE } from "../utils";

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("loadMessages", ({ chatId }) => {
      loadMessages(socket, chatId);
    });

    socket.on("createNewMessage", async (msg) => {
      createNewMessage(io, msg);
    });

    socket.on("createNewChat", (data) => {
      createNewChat(socket, data);
    });

    socket.on("getTeacherChats", (data) => {
      getTeacherChats(socket, data.id);
    });

    socket.on("disconnect", () => {});
  });
};

const loadMessages = async (socket: Socket, chatId: string) => {
  try {
    const messages = await prismaClient.message.findMany({
      where: {
        chatId: chatId,
      },
      include: {
        sender: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    socket.emit("chat", messages);
  } catch (err) {
    console.log(err);
  }
};

const createNewMessage = async (io: Server, msg: any) => {
  try {
    let user = null;
    if (msg.role === ROLE.STUDENT) {
      user = await prismaClient.student.findUnique({
        where: { id: msg.senderId },
        select: { userId: true },
      });
    } else {
      user = await prismaClient.teacher.findUnique({
        where: { id: msg.senderId },
        select: { userId: true },
      });
    }

    if (!user) {
      throw new Error("User not found");
    }

    const sender = await prismaClient.user.findUnique({
      where: { id: user.userId! },
      select: { id: true },
    });

    if (!sender) {
      throw new Error("Sender not found");
    }

    const newMessage = await prismaClient.message.create({
      data: {
        content: msg.content,
        senderId: sender.id,
        chatId: msg.chatId,
      },
      include: {
        sender: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    await prismaClient.chat.update({
      where: { id: msg.chatId },
      data: { updatedAt: new Date() },
    });

    io.emit("message", newMessage);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      io.emit("messageCreationError", { message: err.message });
    } else {
      io.emit("messageCreationError", { message: "Unknown error" });
    }
  }
};

const createNewChat = async (
  socket: Socket,
  data: { lessonId: string; studentId: string; teacherId: string }
) => {
  try {
    const existingChat = await prismaClient.chat.findFirst({
      where: {
        lessonId: data.lessonId,
        studentId: data.studentId,
        teacherId: data.teacherId,
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        lesson: {
          select: {
            title: true,
          },
        },
        student: {
          select: {
            user: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        teacher: {
          select: {
            user: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (existingChat) {
      socket.emit("chatCreated", existingChat);
    } else {
      const newChat = await prismaClient.chat.create({
        data: {
          lesson: {
            connect: { id: data.lessonId },
          },
          student: {
            connect: { id: data.studentId },
          },
          teacher: {
            connect: { id: data.teacherId },
          },
        },
        include: {
          messages: true,
          lesson: {
            select: {
              title: true,
            },
          },
          student: {
            select: {
              user: {
                select: {
                  fullName: true,
                  avatar: true,
                },
              },
            },
          },
          teacher: {
            select: {
              user: {
                select: {
                  fullName: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
      socket.emit("chatCreated", newChat);
    }
  } catch (err) {
    console.error("Error finding or creating chat:", err);
    socket.emit("chatCreationError", {
      message: "Failed to find or create chat",
    });
  }
};

const getTeacherChats = async (
  socket: Socket,
  teacherId: string,
  searchTerm?: string
) => {
  try {
    const chats = await prismaClient.chat.findMany({
      where: {
        teacherId,
        messages: { some: {} },
        student: searchTerm
          ? {
              user: {
                fullName: {
                  contains: searchTerm,
                },
              },
            }
          : undefined,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            desc: true,
            updatedAt: true,
            attachments: true,
            exercises: true,
            class: {
              select: {
                id: true,
                className: true,
              },
            },
          },
        },
        student: {
          select: {
            user: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    socket.emit("teacherChats", chats);
  } catch (err) {
    console.error("Error fetching teacher chats:", err);
    socket.emit("teacherChatsError", {
      message: "Failed to fetch teacher chats",
    });
  }
};
