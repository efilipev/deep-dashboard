import { lazy } from "react";
import loadable from "@/components/Loadable";
const Dashboard = loadable(lazy(() => import("@/pages/Dashboard")));

export const DashboardRoutes = {
  path: "/dashboard",
  element: <Dashboard />,
};
