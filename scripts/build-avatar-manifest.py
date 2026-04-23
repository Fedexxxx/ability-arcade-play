#!/usr/bin/env python3
"""Emit public/avatar/ai/v2/manifest.json with the list of generated PNGs.
Run after `generate-ai-avatars.py` (or any time the set changes) so the
frontend can degrade gracefully to existing variants.
"""
import json
from pathlib import Path

ROOT = Path("public/avatar/ai/v2")
files = sorted(p.name for p in ROOT.glob("*.png"))
manifest = {"version": 2, "files": files}
(ROOT / "manifest.json").write_text(json.dumps(manifest, indent=2))
print(f"manifest.json written with {len(files)} files")