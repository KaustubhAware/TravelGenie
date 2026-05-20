import UserProtectedRoute from "../components/UserProtectedRoute";
import AppLayout from "./AppLayout";

/**
 * Authenticated customer workspace shell.
 * AppLayout + NavbarApp only — no landing chrome.
 */
export default function DashboardLayout() {
  return (
    <UserProtectedRoute>
      <AppLayout />
    </UserProtectedRoute>
  );
}
