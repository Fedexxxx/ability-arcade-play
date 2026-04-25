/**
 * Admin/QA screen — visually verify the 12 character PNGs.
 *
 * Each character is rendered three times so we can confirm the alpha channel
 * and framing are consistent:
 *   1. On a checkerboard (reveals any non-transparent background pixels).
 *   2. On a dark surface (reveals white halos / fringing).
 *   3. On a light surface (reveals dark halos / fringing).
 *
 * Route: /qa/characters
 */

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CHARACTERS } from "@/lib/characters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CHECKER_BG =
  "conic-gradient(hsl(var(--muted)) 25%, transparent 0 50%, hsl(var(--muted)) 0 75%, transparent 0) 0 0/16px 16px";

const CharacterQAPage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Volver">
          <Link to="/personalizar">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">QA · Personajes</h1>
          <p className="text-xs text-muted-foreground">
            Verifica framing y transparencia de los 12 PNGs.
          </p>
        </div>
        <Badge variant="secondary">{CHARACTERS.length} personajes</Badge>
      </header>

      <main className="px-4 py-6 space-y-8 max-w-6xl mx-auto">
        {/* Quick contact-sheet: every character on the same checkerboard */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Hoja de contacto (transparencia)
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 rounded-xl p-2 border border-border"
               style={{ background: CHECKER_BG }}>
            {CHARACTERS.map((c) => (
              <div key={c.id} className="aspect-square flex items-center justify-center">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Per-character triptych: checker / dark / light */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Detalle por personaje
          </h2>

          {CHARACTERS.map((c) => (
            <article
              key={c.id}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold leading-tight">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {c.tier === "free" ? (
                    <Badge variant="secondary">Free</Badge>
                  ) : (
                    <Badge>Gear · {c.price}</Badge>
                  )}
                </div>
              </header>

              <div className="grid grid-cols-3 gap-2">
                <Frame label="Cuadros (alpha)" bg={CHECKER_BG}>
                  <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                </Frame>
                <Frame label="Oscuro" bgClass="bg-foreground">
                  <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                </Frame>
                <Frame label="Claro" bgClass="bg-background border border-border">
                  <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                </Frame>
              </div>

              <p className="text-xs text-muted-foreground truncate">
                <code>{c.image}</code>
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

interface FrameProps {
  label: string;
  bg?: string;
  bgClass?: string;
  children: React.ReactNode;
}

const Frame = ({ label, bg, bgClass, children }: FrameProps) => (
  <figure className="space-y-1">
    <div
      className={`aspect-square rounded-lg overflow-hidden flex items-center justify-center ${bgClass ?? ""}`}
      style={bg ? { background: bg } : undefined}
    >
      {children}
    </div>
    <figcaption className="text-[10px] text-muted-foreground text-center uppercase tracking-wide">
      {label}
    </figcaption>
  </figure>
);

export default CharacterQAPage;