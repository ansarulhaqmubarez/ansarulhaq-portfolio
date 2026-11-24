#!/usr/bin/env bash
# Usage: bash tools/set-domain.sh https://your-domain.af
# Replaces the current domain (default: the workers.dev address; pass a 2nd argument to name another old domain) in every page, sitemap, robots and data/content.js.
set -e
[ -z "$1" ] && { echo "Usage: bash tools/set-domain.sh https://your-domain"; exit 1; }
D="${1%/}"
cd "$(dirname "$0")/.."
OLD="${2:-https://delicate-frost-e2d6.cinecode.workers.dev}"
grep -rl "$OLD" --include=*.html --include=*.xml --include=*.txt --include=*.js . | while read -r f; do
  sed -i "s#$OLD#$D#g" "$f"; echo "updated $f"
done
echo "Done. Domain is now $D"
