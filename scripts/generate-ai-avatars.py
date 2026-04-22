#!/usr/bin/env python3
"""One-shot generator for the AI avatar prototype (Opción D).
Creates 4 outfits x 4 skins x 3 hairs = 48 variants, each in 'bust' and 'full' framing
=> 96 PNGs into public/avatar/ai/v1/. Uses google/gemini-2.5-flash-image via Lovable AI Gateway.
Concurrency via threads. Skips files that already exist for resumability.
"""
import os, sys, json, base64, time, re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

API = "https://ai.gateway.lovable.dev/v1/chat/completions"
KEY = os.environ["LOVABLE_API_KEY"]
OUT = Path("public/avatar/ai/v1"); OUT.mkdir(parents=True, exist_ok=True)
MODEL = "google/gemini-2.5-flash-image"

OUTFITS = {
  "explorer": "bright sherpa-orange technical jacket, classic adventurer scarf, brown hiking boots, small day backpack",
  "alpine":   "deep alpine-blue puffy anorak with a knit beanie, charcoal pants, mountaineering boots",
  "summit":   "red high-altitude summit down jacket, ski goggles resting on the forehead, dark insulated pants",
  "trail":    "khaki light trekking shirt, beige cargo pants, lightweight trail shoes, rolled sleeves",
}
SKINS = {
  "porcelain": "very light porcelain skin tone with warm undertones",
  "honey":     "warm honey skin tone",
  "cocoa":     "rich cocoa-brown skin tone",
  "espresso":  "deep espresso brown skin tone",
}
HAIRS = {
  "short":  "short tidy dark-brown hair",
  "medium": "medium-length wavy dark-brown hair",
  "long":   "long dark-brown hair tied in a ponytail",
}
FRAMES = {
  "bust": "head-and-shoulders bust portrait, square crop, 1024x1024",
  "full": "full body standing, head to feet visible, slight forward lean, weight on right leg, square crop, 1024x1024",
}

PROMPT_TMPL = (
  "Pixar-style 3D character render of a friendly young mountain explorer, gender-neutral child around 9 years old, "
  "kind and curious expression with a soft natural smile, big expressive eyes with light reflections, slight head tilt. "
  "{frame_desc}. Wearing: {outfit_desc}. {skin_desc}. {hair_desc}. "
  "Soft warm cinematic lighting from the upper left, gentle rim light. "
  "Clean transparent background (PNG with alpha). "
  "Consistent character identity across the whole set: same proportions, same face structure, same warm palette. "
  "No text, no logos, no watermark, no border, no shadow on ground."
)

def gen(outfit_id, skin_id, hair_id, frame):
  fname = f"{frame}__outfit-{outfit_id}__skin-{skin_id}__hair-{hair_id}.png"
  fpath = OUT / fname
  if fpath.exists() and fpath.stat().st_size > 5000:
    return fname, "skip"
  prompt = PROMPT_TMPL.format(
    frame_desc=FRAMES[frame],
    outfit_desc=OUTFITS[outfit_id],
    skin_desc=SKINS[skin_id],
    hair_desc=HAIRS[hair_id],
  )
  body = {
    "model": MODEL,
    "messages": [{"role": "user", "content": prompt}],
    "modalities": ["image", "text"],
  }
  for attempt in range(3):
    try:
      r = requests.post(API, headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}, json=body, timeout=120)
      if r.status_code == 429:
        time.sleep(8 * (attempt + 1)); continue
      if r.status_code == 402:
        return fname, "ERR-402-credits"
      if not r.ok:
        return fname, f"ERR-{r.status_code}-{r.text[:120]}"
      data = r.json()
      imgs = data.get("choices", [{}])[0].get("message", {}).get("images") or []
      if not imgs:
        return fname, f"ERR-no-image-{json.dumps(data)[:120]}"
      url = imgs[0].get("image_url", {}).get("url", "")
      m = re.match(r"data:image/[^;]+;base64,(.+)$", url)
      if not m:
        return fname, "ERR-bad-data-url"
      fpath.write_bytes(base64.b64decode(m.group(1)))
      return fname, "ok"
    except Exception as e:
      if attempt == 2: return fname, f"ERR-{type(e).__name__}-{e}"
      time.sleep(4)

jobs = [(o,s,h,f) for o in OUTFITS for s in SKINS for h in HAIRS for f in FRAMES]
print(f"Total jobs: {len(jobs)}", flush=True)
ok = skip = err = 0
errors = []
with ThreadPoolExecutor(max_workers=8) as ex:
  futs = {ex.submit(gen, *j): j for j in jobs}
  for i, fut in enumerate(as_completed(futs), 1):
    name, status = fut.result()
    if status == "ok": ok += 1
    elif status == "skip": skip += 1
    else: err += 1; errors.append((name, status))
    if i % 8 == 0 or status != "ok":
      print(f"[{i}/{len(jobs)}] {status:12s} {name}", flush=True)

print(f"\nDONE  ok={ok} skip={skip} err={err}")
if errors:
  print("Errors:")
  for n, s in errors[:20]: print(f"  {n}: {s}")
  sys.exit(1 if err else 0)
