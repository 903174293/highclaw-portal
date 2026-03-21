#!/usr/bin/env bash
# Pack Next.js standalone into deploy/highclaw-portal/ and deploy/highclaw-portal.tar.gz
# Scripts live under build/; artifacts under deploy/ (gitignored).
#
# 与 DEPLOYMENT_GUIDE / Dockerfile 一致：仅打包运行所需内容，**不在服务器再装依赖**
# - .next/standalone/* → 部署根（含 server.js 与精简 node_modules）
# - .next/static → 部署目录 .next/static
# - public → 部署目录 public
# - 复制 standalone 时**不要** rsync -L（解引用软链会破坏 standalone 内模块布局）
#
# Usage: ./build/package.sh              # run pnpm build, then pack
#        ./build/package.sh --no-build  # pack only from existing .next

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

RUN_BUILD=true
for arg in "$@"; do
  case "$arg" in
    --no-build) RUN_BUILD=false ;;
    -h|--help)
      echo "Usage: $0 [--no-build]"
      echo "  Default: pnpm run build:server, rsync to deploy/highclaw-portal/, write deploy/highclaw-portal.tar.gz"
      exit 0
      ;;
  esac
done

DEPLOY_ROOT="${DEPLOY_ROOT:-$ROOT/deploy}"
PKG_DIR="$DEPLOY_ROOT/highclaw-portal"
OUT_TAR="${OUT_TAR:-$DEPLOY_ROOT/highclaw-portal.tar.gz}"

command -v pnpm >/dev/null 2>&1 || { echo "ERROR: pnpm not found"; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo "ERROR: rsync not found"; exit 1; }

if [[ "$RUN_BUILD" == true ]]; then
  echo ">>> Running: pnpm run build:server"
  pnpm run build:server
fi

if [[ ! -f "$ROOT/.next/standalone/server.js" ]]; then
  echo "ERROR: missing .next/standalone/server.js — run a successful build first"
  exit 1
fi

echo ">>> Clearing staging dir: $PKG_DIR"
rm -rf "$PKG_DIR"
mkdir -p "$PKG_DIR" "$PKG_DIR/.next"

# 使用 -a 保留软链（等同手册里的 cp -r），**禁止** -L：解引用曾导致 standalone 内模块树损坏
echo ">>> rsync standalone (preserve symlinks, no -L)"
rsync -a "$ROOT/.next/standalone/" "$PKG_DIR/"

echo ">>> rsync .next/static"
rsync -a "$ROOT/.next/static/" "$PKG_DIR/.next/static/"

echo ">>> rsync public"
rsync -a "$ROOT/public/" "$PKG_DIR/public/"

echo ">>> Creating archive: $OUT_TAR"
rm -f "$OUT_TAR"
export COPYFILE_DISABLE=1
tar -czf "$OUT_TAR" -C "$DEPLOY_ROOT" highclaw-portal

ls -lh "$OUT_TAR"
echo ">>> Done. Upload deploy/highclaw-portal.tar.gz; on server: sudo bash build/server-deploy.sh (see build/SERVER-DEPLOY.md)"
