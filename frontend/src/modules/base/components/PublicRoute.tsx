import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getProfile } from "../../auth/redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { appPaths } from "../routes";
import { COMPONENT_STAGES } from "../utils";

const PublicRoute = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authState } = useAppSelector((state) => state.auth);
  const isAuthenticated = authState === COMPONENT_STAGES.SUCCESS;

  useEffect(() => {
    if (
      authState === COMPONENT_STAGES.IDLE ||
      authState === COMPONENT_STAGES.SUCCESS
    ) {
      dispatch(
        getProfile({
          handleSuccess: () => {
            navigate(appPaths.ROOT);
          },
        })
      );
    }
  }, [dispatch, authState]);

  if (authState === COMPONENT_STAGES.LOADING) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <Navigate to={appPaths.TEACHER_CLASS} />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
