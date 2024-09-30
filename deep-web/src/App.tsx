import { RouterProvider } from "react-router-dom";
import Loader from "@/components/Loader";
import { router } from "@/routes";

export const App = () => {
  return <RouterProvider router={router} fallbackElement={<Loader />} />;
};
