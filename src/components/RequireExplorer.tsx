import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";
import { useExplorerState } from "@/hooks/useExplorer";

/** Gates the app behind first-time onboarding. */
const RequireExplorer = ({ children }: { children: ReactNode }) => {
  const { explorer, loading } = useExplorerState();
  const location = useLocation();
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
      </div>
    );
  }
  if (!explorer && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

export default RequireExplorer;
