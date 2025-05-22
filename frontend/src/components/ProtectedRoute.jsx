import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useContext(AppContext);

  if (loading) {
    return <div>Loading...</div>; // Wait for checkLogin to finish
  }

  if (!userData) {
    return <Navigate to="/login" />; // Immediately redirect if not logged in
  }

  return children; // ✅ User is logged in
};

export default ProtectedRoute;
