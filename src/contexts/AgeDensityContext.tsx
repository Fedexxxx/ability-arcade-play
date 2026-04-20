import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useExplorer } from "@/hooks/useExplorer";
import { DEFAULT_DENSITY, densityForBand, type DensityTokens } from "@/lib/density";

const AgeDensityContext = createContext<DensityTokens>(DEFAULT_DENSITY);

export const AgeDensityProvider = ({ children }: { children: ReactNode }) => {
  const explorer = useExplorer();
  const tokens = useMemo(() => densityForBand(explorer?.ageBand), [explorer?.ageBand]);

  return (
    <AgeDensityContext.Provider value={tokens}>
      {/* Expose as data attribute too — handy for ad-hoc CSS hooks. */}
      <div data-density={tokens.scale} className="contents">
        {children}
      </div>
    </AgeDensityContext.Provider>
  );
};

/** Read the current age-density tokens. Safe to call without a provider (returns defaults). */
export const useDensity = (): DensityTokens => useContext(AgeDensityContext);
