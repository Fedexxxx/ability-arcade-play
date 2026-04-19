import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";
import { useExplorer } from "@/hooks/useExplorer";

/** Gates the app behind first-time onboarding. */
const RequireExplorer = ({ children }: { children: ReactNode }) => {
  const explorer = useExplorer();
  const location = useLocation();
  if (!explorer && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

export default RequireExplorer;
