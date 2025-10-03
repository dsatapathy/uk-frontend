#!/usr/bin/env bash
set -euo pipefail
echo "PWD=$(pwd)"
node -v
yarn -v

# Your monorepo build (from your package.json)
yarn build
