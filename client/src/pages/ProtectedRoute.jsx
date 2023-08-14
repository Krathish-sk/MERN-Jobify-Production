import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { Loading } from "../components";

export default function ProtectedRoute({ children }) {
  const { user, userLoading } = useAppContext();

  if (userLoading) {
    return <Loading center />;
  }

  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
}
