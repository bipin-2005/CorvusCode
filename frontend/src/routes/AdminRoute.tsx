import { Navigate } from "react-router-dom";
import { getToken, getUser } from "@/services/token";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getToken();
  const user = getUser();

  console.log("TOKEN:", token);
  console.log("USER:", user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin =
    user?.roles?.includes("ROLE_ADMIN");

  console.log("IS ADMIN:", isAdmin);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}