import { createBrowserRouter } from "react-router-dom";
import LayoutPage from "../pages/LayoutPage.jsx";
import ErrorPage from "../pages/ErrorPage";
import AuthPage from "../pages/AuthPage.jsx";
import WorkoutsPage from "../pages/WorkoutsPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <WorkoutsPage />,
      },
      {
        path: "login",
        element: <AuthPage mode="login" />,
      },
        {
            path: "contact",
            element: <ContactPage />,
        },
      {
        path: "signup",
        element: <AuthPage mode="signup" />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
