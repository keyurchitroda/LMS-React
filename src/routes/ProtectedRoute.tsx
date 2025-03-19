import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  roleRequired,
  allowedPages,
  currentPage,
}: {
  children: JSX.Element;
  roleRequired: "admin" | "user";
  allowedPages?: string[];
  currentPage: string;
}) => {
  const users = useSelector(
    (state: any) => state.store.authReducer.currentLoginUser
  );

  const isUserLogin = users;
  const userRole = isUserLogin?.role;

  if (!isUserLogin) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (roleRequired === "admin" && userRole !== "admin") {
    return <Navigate to="/home" replace />;
  }

  if (roleRequired === "user" && userRole !== "user") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (allowedPages && !allowedPages.includes(currentPage)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
