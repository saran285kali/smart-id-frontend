import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/" replace />;

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
