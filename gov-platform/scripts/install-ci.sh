#!/usr/bin/env bash
set -euo pipefail

echo "PWD=$(pwd)"
node -v
yarn -v

# Yarn classic workspace install
yarn install --frozen-lockfile --non-interactive
