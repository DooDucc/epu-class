import React, { Suspense } from "react";
const StudentWrapper = React.lazy(() => import("../components/StudentWrapper"));

const StudentsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentWrapper />
    </Suspense>
  );
};

export default StudentsPage;
