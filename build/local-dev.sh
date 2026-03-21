#!/usr/bin/env bash
# LOCAL MACHINE ONLY — Next.js dev server (pnpm dev). Not for production servers.
# Usage:
#   ./build/local-dev.sh start    # foreground (Ctrl+C to stop)
#   ./build/local-dev.sh stop     # kill listener on PORT (default 3000) + optional PID file

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
PID_FILE="${PID_FILE:-$ROOT/.local-dev.pid}"
LOG_FILE="${LOG_FILE:-$ROOT/.local-dev.log}"

cmd="${1:-}"
case "$cmd" in
  start)
    command -v pnpm >/dev/null 2>&1 || { echo "ERROR: pnpm not found"; exit 1; }
    if [[ "${BACKGROUND:-0}" == "1" ]]; then
      if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "ERROR: already running (PID $(cat "$PID_FILE")). Run: $0 stop"
        exit 1
      fi
      cd "$ROOT"
      echo ">>> Starting in background (log: $LOG_FILE)"
      nohup pnpm dev >>"$LOG_FILE" 2>&1 &
      echo $! >"$PID_FILE"
      echo ">>> PID $(cat "$PID_FILE") — stop with: $0 stop"
      exit 0
    fi
    cd "$ROOT"
    echo ">>> pnpm dev (foreground, Ctrl+C to stop)"
    exec pnpm dev
    ;;
  stop)
    stopped=false
    if [[ -f "$PID_FILE" ]]; then
      pid="$(cat "$PID_FILE" 2>/dev/null || true)"
      if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null; then
        echo ">>> Killing background PID $pid"
        kill "$pid" 2>/dev/null || true
        sleep 1
        kill -9 "$pid" 2>/dev/null || true
        stopped=true
      fi
      rm -f "$PID_FILE"
    fi
    if command -v lsof >/dev/null 2>&1; then
      pids="$(lsof -ti:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
      if [[ -n "${pids:-}" ]]; then
        echo ">>> Killing listener(s) on port $PORT: $pids"
        # shellcheck disable=SC2086
        kill $pids 2>/dev/null || true
        sleep 1
        # shellcheck disable=SC2086
        kill -9 $pids 2>/dev/null || true
        stopped=true
      fi
    else
      echo "WARNING: lsof not found; cannot scan port $PORT"
    fi
    if [[ "$stopped" == true ]]; then
      echo ">>> Done."
    else
      echo ">>> Nothing listening on port $PORT."
    fi
    ;;
  -h|--help|help)
    echo "Usage: $0 start|stop"
    echo "  start              Foreground dev server"
    echo "  BACKGROUND=1 start Detached (uses .local-dev.pid / .local-dev.log)"
    echo "  stop               Stop dev server on PORT (default 3000)"
    ;;
  *)
    echo "ERROR: unknown command: ${cmd:-<empty>}"
    echo "Usage: $0 start|stop   (see: $0 help)"
    exit 1
    ;;
esac
