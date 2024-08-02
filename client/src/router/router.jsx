import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Auth from "../pages/Auth/Auth";
import Home from "../pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Auth mode="login" />,
      },
      {
        path: "signup",
        element: <Auth mode="signup" />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
