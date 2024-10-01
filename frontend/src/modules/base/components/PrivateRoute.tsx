import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getProfile } from "../../auth/redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { appPaths } from "../routes";
import { COMPONENT_STAGES } from "../utils";
import MainLayout from "./MainLayout";
import { ROLE } from "../../auth/utils";

const PrivateRoute = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const authState = useAppSelector((state) => state.auth.authState);
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = authState === COMPONENT_STAGES.SUCCESS;

  useEffect(() => {
    if (authState === COMPONENT_STAGES.IDLE) {
      dispatch(getProfile({}));
    }
  }, [dispatch, authState]);

  if (
    authState === COMPONENT_STAGES.LOADING ||
    authState === COMPONENT_STAGES.IDLE
  ) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={appPaths.SIGN_IN} />;
  }
  if (location.pathname === "/") {
    if (user?.role === ROLE.STUDENT) {
      return <Navigate to={appPaths.STUDENT_CLASS} replace />;
    } else if (user?.role === ROLE.TEACHER) {
      return <Navigate to={appPaths.TEACHER_CLASS} replace />;
    }
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PrivateRoute;
