# HighClaw Portal — build & pack (Makefile)
# Run: make help（勿用「make Makefile」；需 GNU make，macOS /usr/bin/make 即可）

.DEFAULT_GOAL := help

.PHONY: help all install build pack package release ship clean install-ci start start-bg stop

PNPM ?= pnpm
# 与 build/package.sh 一致：默认同 `pnpm build`；内存不够: make ship PACK_BUILD_SCRIPT=build:fast
# 注意：若 shell 里 export 了空的 PACK_BUILD_SCRIPT，?= 不会覆盖空串，会导致 `pnpm run` 无脚本名而失败
PACK_BUILD_SCRIPT ?= build:server
ifeq ($(strip $(PACK_BUILD_SCRIPT)),)
override PACK_BUILD_SCRIPT := build:server
endif
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
	@echo "  make build        Production build (pnpm run build:server, webpack)"
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
	$(PNPM) run $(PACK_BUILD_SCRIPT)

# 拆成 pack + package 依赖，避免个别 make 对「双目标同一配方」解析异常
pack:
	@chmod +x $(PKG_SCRIPT) 2>/dev/null || true
	bash $(PKG_SCRIPT) --no-build

package: pack

# Sequential so install/build never run in parallel under make -j
release:
	@chmod +x $(PKG_SCRIPT) 2>/dev/null || true
	$(PNPM) install
	$(PNPM) run $(PACK_BUILD_SCRIPT)
	bash $(PKG_SCRIPT) --no-build

ship: build
	@chmod +x $(PKG_SCRIPT) 2>/dev/null || true
	bash $(PKG_SCRIPT) --no-build

clean:
	rm -rf $(CURDIR)/deploy/highclaw-portal
	rm -f $(CURDIR)/deploy/highclaw-portal.tar.gz
	@echo "Cleaned deploy/highclaw-portal/ and deploy/highclaw-portal.tar.gz"

all: release
