#!/usr/bin/env bash
# Pack Next.js standalone into deploy/highclaw-portal/ and deploy/highclaw-portal.tar.gz
#
# standalone 内 pnpm 用相对软链管理模块依赖（node_modules/next → .pnpm/next@.../node_modules/next）。
# Node.js 的 require() 依赖软链来定位 peer deps（@next/env、styled-jsx 等）。
# 因此必须用 rsync -a（保留软链），禁止 -L（解引用会破坏模块解析路径）。
#
# Usage: ./build/package.sh [--no-build]
#
# 包内环境文件：始终写入 staging 为 .env.production
#   - 若仓库根存在 .env.production → 原样打入包（勿把含密钥的 tar 传到不可信渠道）
#   - 否则若存在 .env.production.example → 复制为 .env.production（模板，部署前请在服务器核对/补全）

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

RUN_BUILD=true
BUILD_SCRIPT="build:server"
for arg in "$@"; do
  case "$arg" in
    --no-build) RUN_BUILD=false ;;
    -h|--help)
      echo "Usage: $0 [--no-build]"
      echo "  --no-build   skip build, pack existing .next"
      echo "  Env: PACK_BUILD_SCRIPT=build:fast  override build script name"
      echo "  包内 .env.production：优先根目录 .env.production，否则用 .env.production.example"
      exit 0
      ;;
  esac
done

if [[ -n "${PACK_BUILD_SCRIPT:-}" ]]; then
  BUILD_SCRIPT="$PACK_BUILD_SCRIPT"
fi

DEPLOY_ROOT="${DEPLOY_ROOT:-$ROOT/deploy}"
PKG_DIR="$DEPLOY_ROOT/highclaw-portal"
OUT_TAR="${OUT_TAR:-$DEPLOY_ROOT/highclaw-portal.tar.gz}"

command -v pnpm  >/dev/null 2>&1 || { echo "ERROR: pnpm not found"; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo "ERROR: rsync not found"; exit 1; }

# ---------- build ----------
if [[ "$RUN_BUILD" == true ]]; then
  echo ">>> pnpm run $BUILD_SCRIPT"
  pnpm run "$BUILD_SCRIPT"
fi

if [[ ! -f "$ROOT/.next/standalone/server.js" ]]; then
  echo "ERROR: .next/standalone/server.js not found -- build first"
  exit 1
fi

# ---------- pack ----------
export COPYFILE_DISABLE=1

echo ">>> Clearing staging: $PKG_DIR"
rm -rf "$PKG_DIR"
mkdir -p "$PKG_DIR/.next"

# rsync -a：保留 pnpm 软链（Node.js require 靠它定位 peer deps）
echo ">>> rsync -a .next/standalone/ -> staging (preserve symlinks)"
rsync -a "$ROOT/.next/standalone/" "$PKG_DIR/"

echo ">>> rsync -a .next/static/"
rsync -a "$ROOT/.next/static/" "$PKG_DIR/.next/static/"

echo ">>> rsync -a public/"
rsync -a "$ROOT/public/" "$PKG_DIR/public/"

# 生产运行时与 server.js 同级读取 .env.production；包内统一为该文件名
if [[ -f "$ROOT/.env.production" ]]; then
  echo ">>> copy .env.production -> staging（来自仓库根，注意 tar 分发安全）"
  cp "$ROOT/.env.production" "$PKG_DIR/.env.production"
elif [[ -f "$ROOT/.env.production.example" ]]; then
  echo ">>> copy .env.production.example -> staging/.env.production（模板，部署前请补全密钥）"
  cp "$ROOT/.env.production.example" "$PKG_DIR/.env.production"
else
  echo ">>> WARN: 根目录无 .env.production 也无 .env.production.example，包内未含环境文件"
fi

# tar 打包时也保留软链（默认行为，不加 -L / --dereference）
echo ">>> tar -> $OUT_TAR"
rm -f "$OUT_TAR"
mkdir -p "$(dirname "$OUT_TAR")"
tar -czf "$OUT_TAR" -C "$DEPLOY_ROOT" highclaw-portal

ls -lh "$OUT_TAR"
echo ">>> Done."
