#!/usr/bin/env bash
# PRODUCTION SERVER ONLY — deploy highclaw-portal.tar.gz (first-time vs update).
#
# Run from the directory that CONTAINS the tarball (recommended):
#   cd /path/to
#   sudo bash /path/to/repo/build/server-deploy.sh
#   sudo bash /path/to/repo/build/server-deploy.sh ./highclaw-portal.tar.gz
#
# FIRST DEPLOY: extract, PM2, create Nginx site + test + start/reload.
# UPDATE:      extract, PM2 restart only — skips Nginx file changes & reload
#              (existing $NGINX_SITE + sites-enabled link assumed OK).
#
# Override:
#   FORCE_NGINX=1     Always rewrite Nginx site + reload (even on update)
#   SKIP_NGINX=1      Never touch Nginx
#   SKIP_PM2=1        Extract only
#   DEPLOY_MODE=first|update  Force mode (default: auto-detect)
#
# Env: TARGET_DIR, PM2_NAME, PORT, LISTEN_PORT, SERVER_NAMES, NGINX_SITE,
#      NGINX_ENABLED, REMOVE_DEFAULT_SITE, DEPLOY_NON_INTERACTIVE
#
# First deploy + Nginx: creates /etc/nginx/sites-available, writes upstream highclaw_portal_app + server{}.
# (Avoid generic name "next_app" — duplicates another site e.g. highclaw.conf.)
# Interactive (TTY): prompts for server_name, LISTEN_PORT, PORT unless SERVER_NAMES is exported.
# No TTY: DEPLOY_NON_INTERACTIVE=1 and SERVER_NAMES='host1 host2 1.2.3.4' (not "_" alone).

set -euo pipefail

log() { echo ">>> [deploy] $*"; }
log_step() { echo ""; echo "========== $* =========="; }

# 从终端读取一行（sudo 场景下用 /dev/tty 避免 stdin 非终端）
read_tty() {
  local prompt="$1"
  local var="$2"
  local __line
  if [[ ! -r /dev/tty ]]; then
    return 1
  fi
  read -r -p "$prompt" __line < /dev/tty || return 1
  printf -v "$var" '%s' "$__line"
  return 0
}

# 首次写入 Nginx 前：有 SERVER_NAMES 环境变量则跳过询问；否则交互收集；CI/无 TTY 用 DEPLOY_NON_INTERACTIVE=1
collect_nginx_first_install_prefs() {
  local sn_default="_"

  if [[ "$SERVER_NAMES_WAS_SET" == "1" ]] && [[ -n "${SERVER_NAMES// }" ]]; then
    log "Nginx: SERVER_NAMES from environment — skipping domain/port prompts"
    return 0
  fi

  if [[ "$DEPLOY_NON_INTERACTIVE" == "1" ]]; then
    if [[ -z "${SERVER_NAMES// }" ]] || [[ "$SERVER_NAMES" == "_" ]]; then
      log "ERROR: DEPLOY_NON_INTERACTIVE=1 requires SERVER_NAMES (space-separated domains / IPs, not \"_\" alone)"
      exit 1
    fi
    log "Nginx (non-interactive): server_name=$SERVER_NAMES listen=$LISTEN_PORT app=$PORT"
    return 0
  fi

  if [[ ! -r /dev/tty ]]; then
    log "ERROR: no TTY for prompts. Either run from an interactive shell, or:"
    log "       export SERVER_NAMES='highclaw.ai www.highclaw.ai 38.92.15.241'"
    log "       Or: DEPLOY_NON_INTERACTIVE=1 SERVER_NAMES='...' LISTEN_PORT=8080 PORT=3000 ..."
    exit 1
  fi

  log_step "First-time Nginx — customize (Enter = keep default)"
  echo ""
  echo "  server_name: space-separated hostnames and/or IPs"
  echo "               e.g. highclaw.ai www.highclaw.ai 38.92.15.241"
  echo "  catch-all:   leave empty or enter _"
  echo ""
  local line=""
  if read_tty "server_name [${sn_default}]: " line; then
    if [[ -n "${line// }" ]]; then
      SERVER_NAMES="$line"
    else
      SERVER_NAMES="$sn_default"
    fi
  else
    SERVER_NAMES="$sn_default"
  fi

  line=""
  if read_tty "Nginx listen port [${LISTEN_PORT}]: " line && [[ -n "${line// }" ]]; then
    LISTEN_PORT="$line"
  fi

  line=""
  if read_tty "Node / PM2 app port [${PORT}]: " line && [[ -n "${line// }" ]]; then
    PORT="$line"
  fi

  log "Confirmed: server_name=$SERVER_NAMES | nginx listen=$LISTEN_PORT | app port=$PORT"
}

if [[ "${EUID:-0}" -ne 0 ]]; then
  log "ERROR: run as root or sudo"
  exit 1
fi

WORKDIR="$(pwd -P)"

# Resolve tarball: prefer arg; else ./highclaw-portal.tar.gz in cwd
if [[ -n "${1:-}" ]]; then
  TAR_GZ="$1"
  if [[ "$TAR_GZ" != /* ]]; then
    TAR_GZ="$WORKDIR/$TAR_GZ"
  fi
elif [[ -f "$WORKDIR/highclaw-portal.tar.gz" ]]; then
  TAR_GZ="$WORKDIR/highclaw-portal.tar.gz"
else
  echo "Usage: cd <dir-with-tarball> && sudo bash build/server-deploy.sh [highclaw-portal.tar.gz]"
  echo "  Or:   sudo bash build/server-deploy.sh /absolute/path/to/highclaw-portal.tar.gz"
  echo "  Expected default file in current directory: highclaw-portal.tar.gz"
  exit 1
fi

if [[ ! -f "$TAR_GZ" ]]; then
  log "ERROR: archive not found: $TAR_GZ"
  exit 1
fi
TAR_GZ="$(cd "$(dirname "$TAR_GZ")" && pwd)/$(basename "$TAR_GZ")"

TARGET_DIR="${TARGET_DIR:-/var/www/highclaw-portal}"
PM2_NAME="${PM2_NAME:-highclaw-portal}"
PORT="${PORT:-3000}"
LISTEN_PORT="${LISTEN_PORT:-8080}"
# SERVER_NAMES: 未传入环境变量 → 首次可交互询问；已 export 则跳过域名提示（全自动）
# 使用 declare -p 而非 [[ -v ]]，兼容旧版 bash（如 macOS 3.2）
SERVER_NAMES_WAS_SET=0
if declare -p SERVER_NAMES &>/dev/null; then
  SERVER_NAMES_WAS_SET=1
fi
SERVER_NAMES="${SERVER_NAMES-}"
DEPLOY_NON_INTERACTIVE="${DEPLOY_NON_INTERACTIVE:-0}"
NGINX_SITE="${NGINX_SITE:-/etc/nginx/sites-available/highclaw-portal}"
NGINX_ENABLED="${NGINX_ENABLED:-/etc/nginx/sites-enabled/highclaw-portal}"
SKIP_NGINX="${SKIP_NGINX:-0}"
SKIP_PM2="${SKIP_PM2:-0}"
FORCE_NGINX="${FORCE_NGINX:-0}"
REMOVE_DEFAULT_SITE="${REMOVE_DEFAULT_SITE:-0}"
DEPLOY_MODE="${DEPLOY_MODE:-}"

PARENT="$(dirname "$TARGET_DIR")"

# --- detect first deploy vs update (before we move the app dir away) ---
if [[ -n "$DEPLOY_MODE" ]]; then
  case "$DEPLOY_MODE" in
    first|FIRST|initial) MODE="first" ;;
    update|UPDATE) MODE="update" ;;
    *)
      log "ERROR: DEPLOY_MODE must be 'first' or 'update' (got: $DEPLOY_MODE)"
      exit 1
      ;;
  esac
  log "MODE forced by env: $MODE"
elif [[ -f "$TARGET_DIR/server.js" ]]; then
  MODE="update"
  log "MODE: UPDATE (found existing app: $TARGET_DIR/server.js)"
else
  MODE="first"
  log "MODE: FIRST DEPLOY (no existing $TARGET_DIR/server.js)"
fi

log_step "Prerequisites"
log "Tarball:     $TAR_GZ"
log "Target dir:  $TARGET_DIR"
log "PM2 name:    $PM2_NAME"
log "App port:    $PORT (Node / PM2)"
if [[ "$SKIP_NGINX" != "1" ]]; then
  if [[ -n "${SERVER_NAMES// }" ]]; then
    log "Nginx site:  $NGINX_SITE (listen $LISTEN_PORT, server_name $SERVER_NAMES)"
  else
    log "Nginx site:  $NGINX_SITE (listen $LISTEN_PORT, server_name <prompt on first deploy>)"
  fi
fi

# First deploy + need nginx + binary missing → stop early with install hint
if [[ "$MODE" == "first" ]] && [[ "$SKIP_NGINX" != "1" ]]; then
  if ! command -v nginx >/dev/null 2>&1; then
    log_step "Nginx not installed"
    log "This is FIRST DEPLOY and Nginx is required (or set SKIP_NGINX=1 to deploy app-only)."
    echo ""
    echo "  --- Quick install (Debian / Ubuntu) ---"
    echo "    apt-get update && apt-get install -y nginx"
    echo "    systemctl enable nginx"
    echo "    systemctl start nginx"
    echo ""
    echo "  --- RHEL / Fedora (dnf) ---"
    echo "    dnf install -y nginx && systemctl enable --now nginx"
    echo ""
    log "After installing nginx, run this script again."
    exit 1
  fi
  log "OK: nginx is installed ($(command -v nginx))"
fi

if [[ "$MODE" == "update" ]] && [[ "$SKIP_NGINX" != "1" ]] && ! command -v nginx >/dev/null 2>&1; then
  log "WARN: nginx not installed — UPDATE continues (PM2 only). Front proxy unchanged / absent."
fi

# Decide whether to touch Nginx config this run
DO_NGINX=0
if [[ "$SKIP_NGINX" == "1" ]]; then
  log "Nginx: SKIPPED (SKIP_NGINX=1)"
elif [[ "$MODE" == "first" ]]; then
  DO_NGINX=1
  log "Nginx: will CREATE/UPDATE site file (first deploy)"
elif [[ "$FORCE_NGINX" == "1" ]]; then
  DO_NGINX=1
  log "Nginx: will REWRITE site file (FORCE_NGINX=1 on update)"
elif [[ -f "$NGINX_SITE" ]] && { [[ -L "$NGINX_ENABLED" ]] || [[ -f "$NGINX_ENABLED" ]]; }; then
  log "Nginx: SKIPPED on UPDATE (already present: $NGINX_SITE + enabled link)"
  log "        Set FORCE_NGINX=1 to regenerate config and reload nginx."
else
  DO_NGINX=1
  log "Nginx: will CREATE site (update mode but config missing — treating as nginx setup)"
fi

# 首次部署且要写 Nginx：交互定制 server_name / 端口（或已 export SERVER_NAMES 则全自动）
if [[ "$DO_NGINX" == "1" ]] && [[ "$MODE" == "first" ]]; then
  collect_nginx_first_install_prefs
fi
if [[ "$DO_NGINX" == "1" ]] && [[ -z "${SERVER_NAMES// }" ]]; then
  SERVER_NAMES="_"
fi

log_step "Application: extract"
mkdir -p "$PARENT"
log "Parent dir ready: $PARENT"

if [[ "$SKIP_PM2" != "1" ]] && command -v pm2 >/dev/null 2>&1; then
  log "Stopping PM2 app: $PM2_NAME (if running)"
  pm2 stop "$PM2_NAME" 2>/dev/null || log "PM2 stop: not running or first run (OK)"
else
  log "PM2: skip stop (SKIP_PM2=1 or pm2 not installed)"
fi

if [[ -d "$TARGET_DIR" ]]; then
  bak="${TARGET_DIR}.bak.$(date +%Y%m%d%H%M%S)"
  log "Backing up current release -> $bak"
  mv "$TARGET_DIR" "$bak"
else
  log "No existing directory at $TARGET_DIR (clean first deploy path)"
fi

log "Extracting archive into $PARENT ..."
tar -xzf "$TAR_GZ" -C "$PARENT"

if [[ ! -f "$TARGET_DIR/server.js" ]]; then
  log "ERROR: $TARGET_DIR/server.js missing after extract"
  log "       Tarball must contain top-level directory: highclaw-portal/"
  exit 1
fi
log "OK: extracted server.js present"
# standalone 包已含运行所需 node_modules，不在服务器执行 pnpm/npm install

if [[ ! -f "$TARGET_DIR/.env.production" ]]; then
  log "WARN: 未找到 $TARGET_DIR/.env.production"
  log "      第三方登录等依赖运行时环境变量：请执行 cp $TARGET_DIR/.env.production.example .env.production 并填写后"
  log "      pm2 restart $PM2_NAME --update-env；或在 Admin → Settings → Auth 开启 Google/GitHub 并保存。"
fi

if [[ -n "${SUDO_USER:-}" ]]; then
  log "chown to $SUDO_USER:$SUDO_USER"
  chown -R "$SUDO_USER:$SUDO_USER" "$TARGET_DIR" || true
fi

log_step "Application: PM2"
if [[ "$SKIP_PM2" == "1" ]]; then
  log "SKIP_PM2=1 — not starting PM2"
else
  if ! command -v pm2 >/dev/null 2>&1; then
    log "WARN: pm2 not installed — start manually:"
    echo "       cd $TARGET_DIR && NODE_ENV=production HOSTNAME=0.0.0.0 PORT=$PORT node server.js"
    echo ""
    echo "  Install PM2 globally:"
    echo "       npm install -g pm2"
  else
    # 与手动一致：cd 后 export，再 pm2 start；开机自启请自行执行一次 pm2 startup（脚本不代跑，需交互 sudo）
    export NODE_ENV=production
    export HOSTNAME=0.0.0.0
    export PORT
    cd "$TARGET_DIR"
    pm2 delete "$PM2_NAME" 2>/dev/null || true
    log "PM2: start $PM2_NAME (same as: export NODE_ENV HOSTNAME PORT && pm2 start server.js --name $PM2_NAME)"
    pm2 start server.js --name "$PM2_NAME"
    pm2 save
    log "PM2: saved (run 'pm2 startup' once on this host if you need boot persistence)"
  fi
fi

log_step "Nginx"
if [[ "$DO_NGINX" != "1" ]]; then
  log "No Nginx changes this run (see messages above)."
else
  if ! command -v nginx >/dev/null 2>&1; then
    log "ERROR: nginx required to write site file but binary not found"
    echo "  Debian/Ubuntu: apt-get update && apt-get install -y nginx && systemctl enable --now nginx"
    echo "  RHEL/Fedora:   dnf install -y nginx && systemctl enable --now nginx"
    exit 1
  fi

  log "Writing site file: $NGINX_SITE"
  mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled "$(dirname "$NGINX_SITE")"
  log "OK: ensured /etc/nginx/sites-available and sites-enabled exist"

  cat >"$NGINX_SITE" <<EOF
upstream highclaw_portal_app {
    server 127.0.0.1:${PORT};
    keepalive 64;
}

server {
    listen ${LISTEN_PORT};
    listen [::]:${LISTEN_PORT};
    server_name ${SERVER_NAMES};

    location / {
        proxy_pass http://highclaw_portal_app;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
  log "OK: site file written (upstream highclaw_portal_app -> 127.0.0.1:${PORT})"

  if [[ "$REMOVE_DEFAULT_SITE" == "1" ]] && [[ -e /etc/nginx/sites-enabled/default ]]; then
    if [[ "$MODE" == "first" ]] || [[ "$FORCE_NGINX" == "1" ]]; then
      log "Removing default site (REMOVE_DEFAULT_SITE=1)"
      rm -f /etc/nginx/sites-enabled/default
    else
      log "REMOVE_DEFAULT_SITE=1 skipped on UPDATE (set FORCE_NGINX=1 to apply)"
    fi
  fi

  log "Enabling site: ln -sf -> $NGINX_ENABLED"
  ln -sf "$NGINX_SITE" "$NGINX_ENABLED"

  log "Running: nginx -t"
  nginx -t
  if systemctl is-active --quiet nginx 2>/dev/null; then
    log "Reloading nginx (already active)"
    systemctl reload nginx
  else
    log "Starting nginx (was inactive)"
    systemctl enable nginx
    systemctl start nginx
  fi
  log "OK: Nginx listen ${LISTEN_PORT} -> 127.0.0.1:${PORT}"
fi

log_step "Summary"
log "MODE:        $MODE"
log "App path:    $TARGET_DIR"
log "PM2:         $PM2_NAME on port $PORT"
if [[ "$DO_NGINX" == "1" ]]; then
  log "Nginx:       :${LISTEN_PORT} -> app (config updated this run)"
else
  log "Nginx:       unchanged this run"
fi
log "Done."
