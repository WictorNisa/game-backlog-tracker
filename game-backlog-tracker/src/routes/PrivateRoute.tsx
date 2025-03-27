import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  console.log("PrivateRoute check - User:", user, "Token:", token);
  if (!user || !token) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
