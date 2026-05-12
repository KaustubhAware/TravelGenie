import { Outlet } from "react-router-dom";
import NavbarApp from "../components/NavbarApp";

export default function AppLayout() {
  return (
    <>
      <NavbarApp />
      <Outlet />
    </>
  );
}