import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Auth from "../pages/Auth.jsx";
import Home from "../pages/Home.jsx";
import ContactPage from "../pages/Contact.jsx";

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
            path: "contact",
            element: <ContactPage />,
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
