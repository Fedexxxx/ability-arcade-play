import { useEffect, useState } from "react";
import {
  EXPLORER_STYLE_EVENT,
  getExplorerStyle,
  type ExplorerStyle,
} from "@/lib/explorerStyle";

export function useExplorerStyle(): ExplorerStyle {
  const [style, setStyle] = useState<ExplorerStyle>(() => getExplorerStyle());
  useEffect(() => {
    const sync = () => setStyle(getExplorerStyle());
    window.addEventListener(EXPLORER_STYLE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EXPLORER_STYLE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return style;
}
