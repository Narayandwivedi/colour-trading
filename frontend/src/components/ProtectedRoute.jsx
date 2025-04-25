import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
    