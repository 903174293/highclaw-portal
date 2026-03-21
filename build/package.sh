#!/usr/bin/env bash
# Pack Next.js standalone into deploy/highclaw-portal/ and deploy/highclaw-portal.tar.gz
# Scripts live under build/; artifacts under deploy/ (gitignored).
#
# 做法一（推荐）：standalone 用 rsync -aL，把软链落成真实文件/目录，部署机不再依赖 pnpm 软链布局
# - rsync -a：权限、时间等
# - rsync -L：跟随软链拷贝实体，目标侧不留「断链」
# - .next/static、public 仍用 rsync -a（不解引用）
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
      echo "  Default: pnpm run build:server, rsync -aL standalone + rsync static/public, tar.gz"
      exit 0
      ;;
  esac
done

DEPLOY_ROOT="${DEPLOY_ROOT:-$ROOT/deploy}"
PKG_DIR="$DEPLOY_ROOT/highclaw-portal"
OUT_TAR="${OUT_TAR:-$DEPLOY_ROOT/highclaw-portal.tar.gz}"

command -v pnpm >/dev/null 2>&1 || { echo "ERROR: pnpm not found"; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo "ERROR: rsync not found"; exit 1; }
command -v tar >/dev/null 2>&1 || { echo "ERROR: tar not found"; exit 1; }

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

echo ">>> rsync standalone (-aL: 解引用软链，部署最省事)"
rsync -aL "$ROOT/.next/standalone/" "$PKG_DIR/"

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
