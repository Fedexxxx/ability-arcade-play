import { Tent, Mountain, Map, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDensity } from "@/contexts/AgeDensityContext";

const tabs = [
  { path: "/", icon: Tent, label: "Campamento" },
  { path: "/explore", icon: Mountain, label: "Montañas" },
  { path: "/journey", icon: Map, label: "Ruta" },
  { path: "/profile", icon: User, label: "Explorador" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const density = useDensity();

  const hiddenPaths = ["/challenge/"];
  if (hiddenPaths.some((p) => location.pathname.includes(p))) return null;

  // Tap target & label sizing scale with age band.
  const iconSize = density.scale === "lg" ? 28 : density.scale === "md" ? 22 : 20;
  const btnPad = density.scale === "lg" ? "px-4 py-2.5" : density.scale === "md" ? "px-3 py-1.5" : "px-2.5 py-1";
  const labelClass =
    density.scale === "lg" ? "text-xs" : density.scale === "md" ? "text-[10px]" : "text-[10px]";
  const showLabel = density.scale !== "lg" ? true : true; // keep labels for accessibility, just bigger

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/90 backdrop-blur-xl"
      aria-label="Navegación principal"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center gap-0.5 ${btnPad}`}
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 h-1 w-8 rounded-full bg-secondary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                size={iconSize}
                className={isActive ? "text-primary" : "text-muted-foreground"}
                strokeWidth={isActive ? 2.4 : 2}
              />
              {showLabel && (
                <span
                  className={`${labelClass} font-semibold tracking-wide ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
