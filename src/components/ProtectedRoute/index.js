import React, { useContext } from "react";
import ReactContext from "../../context/ReactContext";
import { Navigate, Route } from "react-router-dom";

function ProtectedRoute(props) {
  const { component: Component, ...rest } = props;
  const { isAuthenticated } = useContext(ReactContext);
  return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
