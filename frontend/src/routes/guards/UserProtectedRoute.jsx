import {

  Navigate,

  useLocation,

} from "react-router-dom";



import RouteLoader from "../../components/RouteLoader";

import { useAuth } from "../../context/AuthContext";

import { getUserToken } from "../../utils/authToken";



export default function UserProtectedRoute({

  children,

  roles = [],

}) {

  const location = useLocation();

  const {
    authLoading,
    userInitialized,
    isAuthenticated,
    role,
  } = useAuth();



  if (!userInitialized || authLoading) {

    return (

      <RouteLoader label="Checking authentication..." />

    );

  }



  const hasToken = Boolean(getUserToken());



  if (!isAuthenticated && !hasToken) {

    return (

      <Navigate

        to={

          location.pathname.startsWith("/vendor")

            ? "/vendor/login"

            : "/login"

        }

        state={{

          from: location,

        }}

        replace

      />

    );

  }



  if (roles.length > 0 && role && !roles.includes(role)) {

    const hasAdminSession = Boolean(

      localStorage.getItem("adminToken")

    );

    const fallbackPath =

      role === "vendor"

        ? "/vendor/dashboard"

        : role === "admin" && hasAdminSession

          ? "/admin"

          : "/dashboard";



    return (

      <Navigate

        to={fallbackPath}

        replace

      />

    );

  }



  return children;

}


