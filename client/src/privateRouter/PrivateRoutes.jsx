import React, { useContext } from "react";
import appContext from "../contexts/AppContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRouter() {
  const { pathname } = useLocation();
  const { token } = useContext(appContext);
  return token ? <Outlet /> : <Navigate to={`/login?redirect=${pathname}`} />;
}
