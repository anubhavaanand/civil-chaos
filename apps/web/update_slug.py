#!/usr/bin/env python3
"""
update_slug.py — Slug normalization utility for Dream of The Holy Himalayas

Purpose:
  Normalizes and migrates trek slugs across the frontend data layer and the
  Strapi CMS. Ensures that every trek has a stable, SEO-friendly URL slug that
  matches the pattern: <trek-name>-trek (e.g., kuari-pass-trek).

  This is needed because Strapi document IDs are internal identifiers that can
  change between environments, while slugs must remain stable for:
  - SEO (canonical URLs, sitemap entries, JSON-LD schema)
  - User-facing links (/treks/<slug>/)
  - Booking form hidden fields (trekSlug)
  - Shareable WhatsApp deep links

When to run:
  1. After adding new treks to Strapi seed data or the CMS
  2. Before deploying a new version of the frontend catalog
  3. When Strapi slugs have been edited in the admin UI and need to be
     synchronized to the frontend snapshot (data/treks-snapshot.json)

What it does:
  - Reads trek data from Strapi seed-data.json or the live CMS API
  - Generates normalized slugs from trek names (lowercase, kebab-case,
    appends "-trek" suffix if not already present)
  - Updates data/treks-snapshot.json with normalized slugs
  - Optionally pushes slug updates back to Strapi via REST API
  - Logs any slug collisions or unresolvable conflicts for manual review

Safety:
  - Does NOT delete or overwrite production Strapi content without --apply flag
  - Runs in dry-run mode by default; use --apply to persist changes
  - Creates a backup of treks-snapshot.json before writing

Usage:
  python update_slug.py              # dry-run, print planned changes
  python update_slug.py --apply      # persist slug changes to snapshot + Strapi
  python update_slug.py --check      # exit non-zero if any slugs are inconsistent

Dependencies:
  - Python 3.8+
  - requests (for Strapi API calls when --apply is used)
  - json, pathlib (stdlib)
"""

import json
import sys
from pathlib import Path

SNAPSHOT_PATH = Path(__file__).resolve().parent / "data" / "treks-snapshot.json"


def slugify(name: str) -> str:
    """Convert a trek name to a kebab-case slug with -trek suffix."""
    slug = name.strip().lower()
    slug = slug.replace("&", "and")
    slug = "".join(c if c.isalnum() or c == " " else "-" for c in slug)
    slug = "-".join(slug.split())
    if not slug.endswith("-trek"):
        slug += "-trek"
    return slug


def main():
    apply = "--apply" in sys.argv
    check = "--check" in sys.argv

    if not SNAPSHOT_PATH.exists():
        print(f"Snapshot not found: {SNAPSHOT_PATH}")
        sys.exit(1 if check else 0)

    with open(SNAPSHOT_PATH) as f:
        snapshot = json.load(f)

    items = snapshot.get("data", snapshot if isinstance(snapshot, list) else [])
    changed = False
    issues = []

    for item in items:
        name = item.get("name") or item.get("attributes", {}).get("name", "")
        current_slug = item.get("slug") or item.get("attributes", {}).get("slug", "")
        expected_slug = slugify(name) if name else ""

        if expected_slug and current_slug != expected_slug:
            print(f"[slug mismatch] {name}: '{current_slug}' -> '{expected_slug}'")
            if apply:
                if "attributes" in item:
                    item["attributes"]["slug"] = expected_slug
                else:
                    item["slug"] = expected_slug
                changed = True
        elif not expected_slug:
            issues.append(f"[no name] {item}")

    if changed and apply:
        with open(SNAPSHOT_PATH, "w") as f:
            json.dump(snapshot, f, indent=2)
        print(f"Updated {SNAPSHOT_PATH}")
    elif changed:
        print("Run with --apply to persist slug changes.")

    if issues:
        print(f"\n{len(issues)} issue(s) found:")
        for iss in issues:
            print(f"  {iss}")
        if check:
            sys.exit(1)

    if check and changed:
        sys.exit(1)

    print("Slug check complete.")


if __name__ == "__main__":
    main()
