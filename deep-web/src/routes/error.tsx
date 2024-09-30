import { Navigate } from "react-router-dom";

export const ErrorRoutes = {
  path: "*",
  element: <Navigate to="/dashboard" />,
};
