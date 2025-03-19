import { ComponentType, Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthProtectedRoutes from "./AuthProtectedRoutes";
import AdminLayout from "@/components/shared/AdminLayout/AdminLayout";
import HomeLayout from "@/components/shared/HomeLayout/HomeLayout";

const Loadable =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    return (
      <div>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Component {...props} />
        </Suspense>
      </div>
    );
  };

export default function Router() {
  return useRoutes([
    //  AUTH ROUTES
    {
      path: "/auth",
      children: [
        {
          path: "sign-in",
          element: (
            <AuthProtectedRoutes>
              <SignIn />
            </AuthProtectedRoutes>
          ),
        },
        {
          path: "sign-up",
          element: (
            <AuthProtectedRoutes>
              <SignUp />
            </AuthProtectedRoutes>
          ),
        },
      ],
    },
    //  USER ROLE ROUTES
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        { element: <Navigate to="/home" replace />, index: true },
        {
          path: "home",
          element: (
            <ProtectedRoute roleRequired="user" currentPage="home">
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "about",
          element: (
            <ProtectedRoute
              roleRequired="user"
              allowedPages={["home", "about"]}
              currentPage="about"
            >
              <Test />
            </ProtectedRoute>
          ),
        },
      ],
    },
    //  Admin ROLE ROUTES
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { element: <Navigate to="/dashboard" replace />, index: true },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute roleRequired="admin" currentPage="dashboard">
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "book/list",
          element: (
            <ProtectedRoute
              allowedPages={["book/list"]}
              roleRequired="admin"
              currentPage="book/list"
            >
              <BookList />
            </ProtectedRoute>
          ),
        },
        {
          path: "book/create",
          element: (
            <ProtectedRoute
              allowedPages={["book/create"]}
              roleRequired="admin"
              currentPage="book/create"
            >
              <BookCreate />
            </ProtectedRoute>
          ),
        },
        {
          path: "book/assigned/list",
          element: (
            <ProtectedRoute
              allowedPages={["book/assigned/list"]}
              roleRequired="admin"
              currentPage="book/assigned/list"
            >
              <AssignedBookList />
            </ProtectedRoute>
          ),
        },
      ],
    },
    { path: "*", element: <Navigate to="/auth/sign-in" replace /> },
  ]);
}

//Auth
const SignIn = Loadable(lazy(() => import("../pages/Authentication/Signin")));
const SignUp = Loadable(lazy(() => import("../pages/Authentication/Signup")));

//Users
const Home = Loadable(lazy(() => import("../pages/Home/Home")));
const Test = Loadable(lazy(() => import("../pages/Test/Test")));

//Admin
const Dashboard = Loadable(
  lazy(() => import("../pages/Admin/Dashboard/Dashboard"))
);
const BookList = Loadable(lazy(() => import("../pages/Admin/Book/BookList")));
const BookCreate = Loadable(
  lazy(() => import("../pages/Admin/Book/BookCreate"))
);
const AssignedBookList = Loadable(
  lazy(() => import("../pages/Admin/AssignedBook/AssignedBookList"))
);
