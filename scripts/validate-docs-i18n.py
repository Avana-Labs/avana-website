#!/usr/bin/env python3
"""Validate locale docs.json structure + brand/MT hygiene vs English."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN = json.loads((ROOT / "content/en/docs.json").read_text())

BAD = re.compile(
    r"⟦|⟧|FI \d|Rayon Premium|piscines?\b|zwembad|Emprunter des rayons|Speiche ausleihen",
    re.I,
)
HASHISH = re.compile(r"^[a-z0-9]{16,}$")
SPOKE_BAD = re.compile(
    r"\b(rayon|rayons|speiche|raio|rayo|spook|spoor)\b",
    re.I,
)


def shape(obj):
    if isinstance(obj, dict):
        return {k: shape(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [shape(v) for v in obj]
    if isinstance(obj, str):
        return "str"
    return type(obj).__name__


def walk_strings(obj):
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from walk_strings(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from walk_strings(v)


def main() -> int:
    locales = sys.argv[1:] or [
        p.name
        for p in sorted((ROOT / "content").iterdir())
        if p.is_dir() and p.name != "en" and (p / "docs.json").exists()
    ]
    en_shape = shape(EN)
    failed = 0
    for loc in locales:
        path = ROOT / "content" / loc / "docs.json"
        data = json.loads(path.read_text())
        if shape(data) != en_shape:
            print(f"FAIL {loc}: structure mismatch")
            failed += 1
            continue
        issues = []
        identical = 0
        total = 0
        en_strings = list(walk_strings(EN))
        loc_strings = list(walk_strings(data))
        for a, b in zip(en_strings, loc_strings):
            if not a.strip():
                continue
            total += 1
            if a == b:
                identical += 1
            if BAD.search(b) or (HASHISH.match(b.strip()) and b != a):
                issues.append(f"garbage: {b[:100]!r}")
            if SPOKE_BAD.search(b) and "Spoke" not in b:
                issues.append(f"spoke-mistranslation: {b[:100]!r}")
        pct = 100 * identical / total if total else 0
        if issues:
            print(f"FAIL {loc}: {len(issues)} hygiene issues; identical={identical}/{total} ({pct:.1f}%)")
            for i in issues[:8]:
                print(" ", i)
            failed += 1
        elif pct > 98 and loc not in {"en"}:
            print(f"WARN {loc}: still mostly English ({pct:.1f}% identical)")
            failed += 1
        else:
            print(f"OK {loc}: identical={identical}/{total} ({pct:.1f}%)")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
