import { Outlet } from "react-router";
import { RouterProvider } from "react-router";
import { router } from "./routes";

function Root() {
  return <Outlet />;
}

export default function App() {
  return <RouterProvider router={router} />;
}

export { Root };
