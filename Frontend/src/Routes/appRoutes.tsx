import { useRoutes } from "react-router-dom";
import Home from "../Pages/Home/Home";
import authRoutes from "./authRoutes";
import Form from "../Features/Repos/Features/Form/Form";

const AppRoutes = () => {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/repo",
      element: <Form />,
    },
    ...authRoutes,
  ]);
};

export default AppRoutes;
