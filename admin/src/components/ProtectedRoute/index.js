import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MyContext } from "../../App";

const ProtectedRoute = () => {
  const { isLogin } = useContext(MyContext);
  return isLogin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
