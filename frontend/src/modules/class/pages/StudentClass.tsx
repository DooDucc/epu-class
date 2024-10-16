/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/material";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  appPaths,
  COMPONENT_STAGES,
  EmptyResult,
  Loading,
  useAppDispatch,
  useAppSelector,
} from "../../base";
import { AvailableClasses, ClassCodeModal, JoinedClasses } from "../components";
import ClassHeader from "../components/Student/ClassHeader";
import { getPublishedClasses, joinClass } from "../redux/actions";
import { Class, Student } from "../types";

const StudentClass = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const {
    class: { data, state },
  } = useAppSelector((state) => state.class);
  const { user } = useAppSelector((state) => state.auth);

  const [joinedClasses, setJoinedClasses] = useState<Class[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);

  const debouncedGetPublishedClasses = useCallback(
    debounce((search: string) => {
      dispatch(
        getPublishedClasses({
          page: 1,
          limit: 9,
          search: search,
        })
      );
    }, 300),
    []
  );

  useEffect(() => {
    debouncedGetPublishedClasses(searchTerm);

    return () => {
      setJoinedClasses([]);
      setAvailableClasses([]);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (data && user) {
      const joinedClasses: Class[] = [];
      const availableClasses: Class[] = [];

      data.forEach((classItem) => {
        if (classItem.students.some((student) => student.id === user.id)) {
          joinedClasses.push(classItem);
        } else {
          availableClasses.push(classItem);
        }
      });

      setJoinedClasses(joinedClasses);
      setAvailableClasses(availableClasses);
    }
  }, [data, user]);

  const handleCardClick = (classItem: Class) => {
    if (user) {
      const isRegisterCourse = classItem.students.some(
        (student: Student) => student.id === user.id
      );
      const path = isRegisterCourse
        ? `${appPaths.STUDENT_CLASS}/${classItem.id}`
        : `${appPaths.STUDENT_CLASS}/${classItem.id}/review`;

      navigate(path);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedClass(null);
  };

  const handleCodeSubmit = (classCode: string) => {
    dispatch(
      joinClass({
        classCode,
        userId: user?.id || "",
        handleSuccess: () => {
          navigate(`${appPaths.STUDENT_CLASS}/${selectedClass?.id}`);
          toast.success("Joined class successfully");
        },
        handleFail: (errorMessage) => {
          toast.error(errorMessage);
        },
      })
    );
    handleModalClose();
  };

  return (
    <Box sx={{ p: 2, flex: 1 }}>
      <ClassHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Typography variant="h5" color="primary" mt={4} mb={2}>
        Joined Classes
      </Typography>
      {joinedClasses.length > 0 ? (
        <JoinedClasses
          classes={joinedClasses}
          handleCardClick={handleCardClick}
        />
      ) : (
        <EmptyResult
          message="You haven't joined any classes yet."
          height={200}
        />
      )}

      <Typography variant="h5" color="primary" mt={4} mb={2}>
        Available Classes
      </Typography>
      {availableClasses.length > 0 ? (
        <AvailableClasses
          classes={availableClasses}
          handleCardClick={handleCardClick}
        />
      ) : (
        <EmptyResult message="No available classes found." height={200} />
      )}

      <ClassCodeModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleCodeSubmit}
        className={selectedClass?.className || ""}
      />
    </Box>
  );
};

export default StudentClass;
