#!/usr/bin/env bash
set -euo pipefail
echo "PWD=$(pwd)"
node -v
yarn -v

yarn build

OUT="apps/uk-portal/dist"
echo "Listing output at $OUT"
ls -la "$OUT"

# hard fail if dir missing or empty
if [ ! -d "$OUT" ] || [ -z "$(ls -A "$OUT")" ]; then
  echo "❌ Expected build output not found at: $OUT"
  exit 1
fi
