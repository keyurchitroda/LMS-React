import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  const users = useSelector(
    (state: any) => state.store.authReducer.currentLoginUser
  );

  const isUserLogin = users;
  const role = isUserLogin?.role;

  if (isUserLogin && role) {
    return role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/home" replace />
    );
  }

  return children;
};

export default AuthProtectedRoutes;
