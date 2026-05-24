import { useRoutes } from "react-router-dom";

import publicRoutes from "./PublicRoutes";
import dashboardRoutes from "./DashboardRoutes";
import adminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  const routes = [
    ...publicRoutes,
    ...dashboardRoutes,
    ...adminRoutes,
  ];

  return useRoutes(routes);
};

export default AppRoutes;