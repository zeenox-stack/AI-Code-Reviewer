import type { RouteObject } from "react-router-dom";
import Login from "../Pages/Login/Login";

const authRoutes: RouteObject[] = [
    {
        path: "/auth/login",  
        element: <Login />
    }
]; 

export default authRoutes;