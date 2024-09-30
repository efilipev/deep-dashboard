import { createBrowserRouter } from "react-router-dom";
import { DashboardRoutes } from "@/routes/dashboard.tsx";
import { ErrorRoutes } from "@/routes/error.tsx";

export const router = createBrowserRouter([DashboardRoutes, ErrorRoutes]);
