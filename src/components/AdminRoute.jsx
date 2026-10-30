
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        Checking admin access...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <h2>Access Denied — Admin Only</h2>
      </div>
    );
  }

  return children;
}
