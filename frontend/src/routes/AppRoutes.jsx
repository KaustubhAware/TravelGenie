import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";

import publicRoutes from "./PublicRoutes";
import dashboardRoutes from "./DashboardRoutes";
import adminRoutes from "./AdminRoutes";
import RouteLoader from "../components/RouteLoader";

const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  const routes = [
    ...publicRoutes,
    ...dashboardRoutes,
    ...adminRoutes,
    {
      path: "*",
      element: (
        <Suspense fallback={<RouteLoader label="Loading..." />}>
          <NotFound />
        </Suspense>
      ),
    },
  ];

  return useRoutes(routes);
};

export default AppRoutes;