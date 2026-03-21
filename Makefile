# HighClaw Portal — build & pack (Makefile)
# Run: make help

.PHONY: help all install build pack package release ship clean install-ci start start-bg stop

PNPM ?= pnpm
PKG_SCRIPT := $(CURDIR)/build/package.sh
LOCAL_DEV_SCRIPT := $(CURDIR)/build/local-dev.sh

help:
	@echo "HighClaw Portal — common targets"
	@echo ""
	@echo "  make start        Local dev (pnpm dev, foreground)"
	@echo "  make start-bg     Same, detached (nohup + .local-dev.pid)"
	@echo "  make stop         Stop local dev on PORT (default 3000)"
	@echo ""
	@echo "  make install      Install deps (pnpm install)"
	@echo "  make install-ci   CI install (frozen lockfile)"
	@echo "  make build        Production build only (pnpm run build:server)"
	@echo "  make pack         Pack tar only (requires existing .next, no rebuild)"
	@echo "  make package      Same as pack"
	@echo "  make release / all  install + build + pack tar (sequential)"
	@echo "  make ship         When node_modules exists: build + pack tar"
	@echo "  make clean        Remove deploy/highclaw-portal/ and deploy/highclaw-portal.tar.gz"
	@echo ""
	@echo "Staging + artifact live under deploy/; scripts live under build/"
	@echo "Artifact: deploy/highclaw-portal.tar.gz"
	@echo "Server:    sudo bash build/server-deploy.sh /path/to/highclaw-portal.tar.gz"

start:
	@chmod +x $(LOCAL_DEV_SCRIPT) 2>/dev/null || true
	bash $(LOCAL_DEV_SCRIPT) start

start-bg:
	@chmod +x $(LOCAL_DEV_SCRIPT) 2>/dev/null || true
	BACKGROUND=1 bash $(LOCAL_DEV_SCRIPT) start

stop:
	@chmod +x $(LOCAL_DEV_SCRIPT) 2>/dev/null || true
	bash $(LOCAL_DEV_SCRIPT) stop

install:
	$(PNPM) install

install-ci:
	$(PNPM) install --frozen-lockfile

build:
	$(PNPM) run build:server

pack package:
	@chmod +x $(PKG_SCRIPT) 2>/dev/null || true
	bash $(PKG_SCRIPT) --no-build

# Sequential so install/build never run in parallel under make -j
release:
	@chmod +x $(PKG_SCRIPT) 2>/dev/null || true
	$(PNPM) install
	$(PNPM) run build:server
	bash $(PKG_SCRIPT) --no-build

ship: build
	@chmod +x $(PKG_SCRIPT) 2>/dev/null || true
	bash $(PKG_SCRIPT) --no-build

clean:
	rm -rf $(CURDIR)/deploy/highclaw-portal
	rm -f $(CURDIR)/deploy/highclaw-portal.tar.gz
	@echo "Cleaned deploy/highclaw-portal/ and deploy/highclaw-portal.tar.gz"

all: release
