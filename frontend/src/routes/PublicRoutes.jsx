import { lazy, Suspense } from "react";

import LandingLayout from "../layouts/LandingLayout";

import RouteLoader from "../components/RouteLoader";
import ErrorBoundary from "../components/ErrorBoundary";

const Home = lazy(() =>
  import("../pages/public/Home")
);

const Login = lazy(() =>
  import("../pages/auth/Login")
);

const Register = lazy(() =>
  import("../pages/auth/Register")
);

const withSuspense = (
  element,
  label
) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <RouteLoader label={label} />
      }
    >
      {element}
    </Suspense>
  </ErrorBoundary>
);

const publicRoutes = [
  {
    path: "/",
    element: <LandingLayout />,

    children: [
      {
        index: true,

        element: withSuspense(
          <Home />,
          "Loading TravelGenie..."
        ),
      },

      {
        path: "login",

        element: withSuspense(
          <Login />,
          "Loading login..."
        ),
      },

      {
        path: "register",

        element: withSuspense(
          <Register />,
          "Loading registration..."
        ),
      },
    ],
  },
];

export default publicRoutes;