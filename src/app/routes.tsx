import { createBrowserRouter } from "react-router";
import { Root } from "./App";
import { UnifiedLogin } from "./pages/UnifiedLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: UnifiedLogin },
      { path: "login", Component: UnifiedLogin },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "student/dashboard", Component: StudentDashboard },
    ],
  },
]);
