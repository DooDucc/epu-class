import SchoolIcon from "@mui/icons-material/School";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MessageIcon from "@mui/icons-material/Message";

export const TEACHER_SIDEBAR = [
  {
    id: 1,
    name: "Classes",
    icon: <SchoolIcon />,
    link: "/teacher/classes",
  },
  {
    id: 3,
    name: "Lessons",
    icon: <CastForEducationIcon />,
    link: "/teacher/lessons",
  },
  {
    id: 4,
    name: "Students",
    icon: <LocalLibraryIcon />,
    link: "/teacher/students",
  },
  {
    id: 5,
    name: "Exercises",
    icon: <StickyNote2Icon />,
    link: "/teacher/exercises",
  },
  {
    id: 6,
    name: "Chats",
    icon: <MessageIcon />,
    link: "/teacher/chats",
  },
  {
    id: 7,
    name: "Reports",
    icon: <AssessmentIcon />,
    link: "/teacher/reports",
  },
];

export const STUDENT_SIDEBAR = [
  {
    id: 1,
    name: "Classes",
    icon: <SchoolIcon />,
    link: "/student/classes",
  },
  {
    id: 2,
    name: "Lessons",
    icon: <CastForEducationIcon />,
    link: "/student/lessons",
  },
];
