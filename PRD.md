# Product Requirements Document (PRD)

## 1. Product Overview

- **Product Name**: HighClaw Official Portal
- **Product Positioning**: The official website for HighClaw — a high-performance, single-binary AI agent infrastructure built 100% in Go. The portal serves as the primary marketing, documentation, and community hub.
- **Target Users**: Developers, DevOps engineers, AI enthusiasts, teams migrating from OpenClaw/LangChain/AutoGPT, and enterprises seeking self-hosted multi-agent solutions.
- **Core Problem**: HighClaw needs a professional, tech-forward portal to establish brand credibility, showcase its differentiated advantages (performance, multi-agent, zero-dependency memory), drive GitHub stars, downloads, and community adoption.

## 2. User Analysis

| User Type | Characteristics | Core Need | Scenario |
|:---------:|:---------------:|:---------:|:--------:|
| Individual Developer | Familiar with CLI tools, uses terminal daily, values performance and simplicity | Quick install, understand core value in 30 seconds | Discovers HighClaw via GitHub/HackerNews, visits portal to evaluate |
| DevOps / Infra Engineer | Manages servers, cares about deployment cost and binary size | Deployment guides, platform downloads, security docs | Evaluating self-hosted AI assistant for team |
| OpenClaw Migrator | Current OpenClaw user, frustrated with Node.js overhead | Migration path, comparison table, feature parity proof | Considering switching to Go-based alternative |
| Enterprise Decision Maker | CTO/VP Engineering, evaluates team/security/scalability | Team credentials, security features, multi-agent capabilities | Due diligence before adopting for organization |

## 3. Page Architecture

### 3.1 Page List

| Page Name | Type | Core Function | User Value | Entry Point | Priority |
|:---------:|:----:|:------------:|:----------:|:-----------:|:--------:|
| Landing (Home) | Main page | Brand positioning + core value proposition | Understand HighClaw in 30 seconds | Direct URL / Search | P0 |
| Download | Feature page | Platform-aware binary downloads | Get HighClaw installed immediately | Nav: Download | P0 |
| Tutorials | Feature page | Comprehensive feature module guides | Learn every HighClaw capability | Nav: Tutorials | P0 |
| Team | Info page | Core team profiles | Build trust and credibility | Nav: Team | P1 |
| Contact Us | Feature page | Contact form + social links | Reach the team | Nav: Contact Us | P1 |
| Sign In | Auth page | User authentication | Access gated features | Nav: Sign In | P1 |
| Sign Up | Auth page | User registration | Create account | Nav: Sign Up | P1 |

### 3.2 Navigation Bar

```
Logo | Download | Tutorials | GitHub(↗) | Team | Contact Us     [ Sign In ] [ Sign Up ]
```

- **Logo**: HighClaw brand mark, links to home
- **Download**: Scrolls to / navigates to download section with auto-detected platform
- **Tutorials**: Opens tutorials hub with sidebar navigation
- **GitHub**: External link (opens in new tab) to `https://github.com/903174293/highclaw`
- **Team**: Core team profiles page
- **Contact Us**: Contact form page
- **Sign In / Sign Up**: Right-aligned auth buttons

### 3.3 Page Detailed Requirements

---

#### Page 1: Landing (Home) — `/`

- **Page Goal**: Communicate HighClaw's core value in under 30 seconds; drive visitors to Download or GitHub.
- **Design Principle**: Clean, minimal, authoritative. 6 modules, 3-4 scroll screens max. Each module conveys ONE key message with visual support.

**Module 1 — Hero Section**

- **Headline**: `High-Performance AI Agent Infrastructure`
- **Sub-headline**: `Single binary. 22+ providers. 12+ channels. Deploy anywhere, swap anything. 100% Go.`
- **Terminal code block**: `git clone ... && make build && make install && highclaw onboard`
- **Dual CTA**: `[ Get Started ]` (→ Download) `[ View on GitHub ]` (→ GitHub)
- **Visual**: Dark background with subtle particle/grid animation (CSS-only or lightweight canvas), no heavy libraries

**Module 2 — Why HighClaw (4 Advantage Cards)**

Four cards in a horizontal grid, each with icon + title + one-line description:

| Icon | Title | Description |
|:----:|:-----:|:-----------:|
| Binary icon | Single Binary | One Go binary, zero runtime dependencies. Install in seconds, not minutes. |
| Brain/AI icon | 22+ AI Providers | OpenRouter, Anthropic, OpenAI, Ollama, DeepSeek, Gemini, and more. Swap with one config change. |
| Message icon | 12+ Channels | Telegram, Discord, Slack, WhatsApp, Feishu, WeChat — one gateway connects them all. |
| Shield icon | Secure by Default | Pairing auth, sandbox isolation, workspace scoping, encrypted secrets. |

**Module 3 — Multi-Agent Architecture (Core Selling Point)**

- **Section title**: `Built for Multi-Agent Collaboration`
- **One-line**: `Run a team of specialized AI agents in a single instance — each with its own identity, workspace, model, and tools.`
- **Visual**: Animated/interactive architecture diagram showing:
  ```
  Incoming Messages → Gateway → MultiBotRouter → [PM Agent] [Engineer Agent] [Writer Agent]
                                                    ↕ agent_send / agent_spawn
  ```
- **3 sub-highlights** below the diagram (icon + short text):
  - `Agent-to-Agent Communication` — Agents consult and delegate tasks to each other
  - `Sub-Agent Spawn` — Delegate sub-tasks with automatic result reporting
  - `8-Level Priority Routing` — Route messages by channel, account, peer, and group

**Module 4 — Three-Layer Memory System (Technical Highlight)**

- **Section title**: `Industry-Leading Memory System`
- **One-line**: `Full-stack search engine inside a single SQLite file. No Pinecone. No Elasticsearch. No Redis.`
- **Visual**: Three-layer vertical diagram:
  ```
  L1  Session History     ← Per-session conversation tracking
  L2  Notes / Compaction  ← Auto-compressed long-term memory
  L3  SQLite / Embedding  ← Hybrid search: FTS5 + Vector Cosine Similarity
  ```
- **Key stats** in a row: `30-60x faster` | `CJK auto-fallback` | `100/batch embedding` | `Zero external deps`

**Module 5 — Comparison Table**

- **Section title**: `How HighClaw Compares`
- **Clean comparison table** with check/cross icons:

| Capability | HighClaw | OpenClaw | LangChain | AutoGPT |
|:----------:|:--------:|:--------:|:---------:|:-------:|
| Single binary deployment | ✅ | ❌ | ❌ | ❌ |
| Native hybrid memory (no external DB) | ✅ | ❌ | ❌ | ❌ |
| Multi-agent with A2A communication | ✅ | ✅ | ❌ | ❌ |
| 12+ messaging channels built-in | ✅ | ✅ | ❌ | ❌ |
| CJK full-text search | ✅ | ❌ | ❌ | ❌ |
| Sub-agent task delegation | ✅ | ✅ | ❌ | ❌ |
| Zero runtime dependencies | ✅ | ❌ | ❌ | ❌ |
| Cross-platform binary release | ✅ | ❌ | ❌ | ❌ |

**Module 6 — Get Started CTA**

- **Section title**: `Get Started in 3 Steps`
- **Terminal-style code block**:
  ```bash
  # 1. Build
  git clone https://github.com/903174293/highclaw.git && cd highclaw && make build && make install

  # 2. Setup
  highclaw onboard --interactive

  # 3. Chat
  highclaw agent -m "Hello, HighClaw!"
  ```
- **Dual CTA**: `[ Download ]` `[ Star on GitHub ]`

---

#### Page 2: Download — `/download`

- **Page Goal**: Get users to download the correct binary for their platform instantly.
- **Core Function**: Auto-detect visitor's OS/architecture, highlight recommended download, show all 6 platform options.

**Auto-Detection Hero Card (page center)**:
- JavaScript detects `navigator.platform` / `userAgent`
- Shows: platform icon + "Recommended for your system" badge + platform name + filename + primary Download button
- Below: `Or install from source: make build && make install`

**Multi-Platform Grid (below hero card)**:

6 cards in 2x3 or 3x2 grid:

| Platform | Icon | Filename | Status |
|:--------:|:----:|:--------:|:------:|
| macOS (Apple Silicon) | Apple logo SVG (monochrome) | `highclaw-darwin-arm64.tar.gz` | Live |
| macOS (Intel) | Apple logo SVG | `highclaw-darwin-amd64.tar.gz` | Live |
| Windows (x64) | Windows 11 logo SVG | `highclaw-windows-amd64.zip` | Live |
| Windows (ARM) | Windows 11 logo SVG | `highclaw-windows-arm64.zip` | Live |
| Linux (x64) | Tux penguin SVG (clean line style) | `highclaw-linux-amd64.tar.gz` | Live |
| Linux (ARM64) | Tux penguin SVG | `highclaw-linux-arm64.tar.gz` | Live |

- **Version display**: `v1.0.0` prominently shown
- **System Requirements note**: `Go 1.22+ (build from source only) | Single binary, zero dependencies`
- **GitHub Releases link**: `View all releases on GitHub →`

**Icon requirements**: Use `@tabler/icons-react` (already in project dependencies) for platform icons. Apple/Windows/Linux brand icons from `react-icons/si` (Simple Icons) for official brand marks. Must be crisp, monochrome-compatible with the dark theme.

---

#### Page 3: Tutorials — `/tutorials`

- **Page Goal**: Comprehensive learning hub for all HighClaw features.
- **Core Function**: Sidebar navigation + content area, organized by feature module.
- **Layout**: Left sidebar with category tree + main content area (similar to documentation sites)

**Tutorial Modules**:

| # | Module | Route | Content Source | Key Topics |
|:-:|:------:|:-----:|:--------------:|:----------:|
| 1 | Quick Start | `/tutorials/quick-start` | README Quick Start | Install, onboard, first chat, TUI |
| 2 | Multi-Agent Setup | `/tutorials/multi-agent` | multi-agent-guide.md | Architecture, config, routing, persona, A2A, spawn, Feishu team case |
| 3 | Memory System | `/tutorials/memory` | README Memory + system-features-guide.md | L1/L2/L3, hybrid search, CJK fallback, batch embedding, CLI commands |
| 4 | Heartbeat System | `/tutorials/heartbeat` | heartbeat-guide.md | Scheduled tasks, HEARTBEAT_OK, active hours, multi-agent frequency |
| 5 | Build & Deploy | `/tutorials/build-deploy` | build-guide.md | Compile, cross-compile, make deploy, go:embed, platform release |
| 6 | Task Audit Log | `/tutorials/task-audit` | system-features-guide.md §1 | SQLite audit, FTS5 search, pagination, filtering, stats |
| 7 | Service Logs | `/tutorials/logs` | system-features-guide.md §2 | Log rotation, live tail, cross-file search, config |
| 8 | Channel Integration | `/tutorials/channels` | README Channels | 12+ channels, DM/Group/Multi-Bot modes, pairing auth, WhatsApp setup |
| 9 | Session Management | `/tutorials/sessions` | README Sessions | Unified engine, DM scope, cross-channel identity, slash commands |
| 10 | Security & Sandbox | `/tutorials/security` | README Security | Workspace isolation, command allowlist, pairing, tunnel, approval mechanism |
| 11 | Skills System | `/tutorials/skills` | README Skills | SKILL.md driven, community repo, custom skills, onboard integration |
| 12 | CLI Reference | `/tutorials/cli-reference` | README Commands | 60+ commands organized by category |
| 13 | Identity & AIEOS | `/tutorials/identity` | README Identity | OpenClaw format, AIEOS v1.1 JSON, persona files |
| 14 | Gateway API | `/tutorials/gateway-api` | README Gateway API | REST endpoints, pairing flow, WebSocket, cron API |

**Content format per tutorial page**:
- Title + brief overview
- Table of contents (auto-generated from headings)
- Code blocks with syntax highlighting (terminal style)
- Configuration YAML examples
- Architecture diagrams where applicable (ASCII or SVG)
- "Next tutorial →" navigation at bottom

---

#### Page 4: Team — `/team`

- **Page Goal**: Establish credibility through world-class team profiles.
- **Core Function**: Display core team members with photo placeholders, names, roles, and impressive backgrounds.
- **Layout**: Grid of profile cards (2x3 or 3x2), each with avatar, name, title, short bio, and social links (LinkedIn/GitHub/Twitter icons).

**Team Members**:

| Name | Role | Avatar | Bio |
|:----:|:----:|:------:|:---:|
| **Marcus Chen** | Founder & CEO | Placeholder avatar | Former Senior Researcher at Google Brain. Ph.D. in Computer Science from Carnegie Mellon University. Led the multi-agent architecture design for Google Assistant. Published 12 papers at NeurIPS and ICML. Passionate about making AI infrastructure accessible to every developer. |
| **Elena Volkov** | Chief Technology Officer | Placeholder avatar | Former Principal Architect at Microsoft Azure AI. M.S. in EECS from MIT. Led the Azure Cognitive Services multi-language team serving 200M+ API calls daily. 10 years of distributed systems experience across Microsoft and Amazon. |
| **James Nakamura** | VP of Engineering | Placeholder avatar | Former Engineering Director at Meta Infrastructure. M.S. in Computer Science from Stanford University. Managed 200+ engineers building Meta's internal AI toolchain. Previously at Uber, where he architected the real-time ML serving platform. |
| **Sarah Mitchell** | Head of Product | Placeholder avatar | Former Product Lead at Anthropic. Harvard MBA and UC Berkeley CS dual degree. Defined the go-to-market strategy for Claude API. Previously PM at Stripe, shipping developer-facing payment infrastructure used by millions. |
| **David Park** | Lead AI Researcher | Placeholder avatar | Former Research Scientist at DeepMind. D.Phil. in Machine Learning from University of Oxford. Specializes in agent collaboration systems and emergent behavior. Best Paper Award at ACL 2024 and EMNLP 2023. |
| **Aria Santos** | Head of Security | Placeholder avatar | Former Zero Trust Security Engineering Director at Cloudflare. M.S. in Information Security from Georgia Tech. OSCP and CISSP certified. Led the design of multiple cloud security standards adopted by Fortune 500 companies. |

---

#### Page 5: Contact Us — `/contact`

- **Page Goal**: Provide clear communication channels for inquiries, partnerships, and feedback.
- **Layout**: Split layout — left side: contact form, right side: info + social links.

**Contact Form Fields**:
- Name (required)
- Email (required)
- Subject (dropdown: General Inquiry / Partnership / Bug Report / Feature Request / Enterprise)
- Message (textarea, required)
- Submit button

**Info Section**:
- Email: `contact@highclaw.ai` (placeholder)
- GitHub: Link to repository
- Discord: Community server link (placeholder)
- Twitter/X: `@highclaw_ai` (placeholder)

---

#### Page 6 & 7: Sign In / Sign Up — `/sign-in` `/sign-up`

- **Page Goal**: User authentication for future gated features (API keys, cloud dashboard, etc.).
- **Core Function**: Leverage existing better-auth module in the project.
- **Implementation**: Reuse `src/core/auth/` (already supports Google, GitHub social login + email/password).
- **Layout**: Centered card with logo, form fields, social login buttons, and toggle link between Sign In / Sign Up.

---

## 4. User Stories

### P0 Core Features:
- As a **developer**, I want to understand what HighClaw is within 10 seconds of landing on the homepage, so I can decide if it solves my problem.
- As a **developer**, I want to download the correct binary for my OS with one click, so I can start using HighClaw immediately.
- As a **learner**, I want structured tutorials covering every HighClaw feature, so I can become productive quickly.
- As a **developer**, I want to see a clear comparison with alternatives (OpenClaw, LangChain), so I can justify choosing HighClaw.

### P1 Important Features:
- As a **decision maker**, I want to see the team's credentials, so I can trust the project's long-term viability.
- As a **user**, I want to contact the team easily, so I can report issues or explore partnerships.
- As a **user**, I want to create an account, so I can access future gated features.

## 5. User Flow

### Primary Path (New Visitor):
```
Land on Home → Read Hero (10s) → Scan Why HighClaw → See Multi-Agent diagram → View comparison table → Click "Download" → Auto-detect OS → Download binary → Follow Quick Start tutorial
```

### Secondary Path (Evaluator):
```
Land on Home → Click Tutorials → Browse Multi-Agent guide → Read Memory System → Return to Home → View Team → Click GitHub → Star repo
```

### Page Flow:
```
Home ←→ Download
  ↓         ↓
Tutorials   Team
  ↓         ↓
(14 sub-pages) Contact Us
                ↓
          Sign In / Sign Up
```

## 6. Design Specifications

### Color System (Dark Theme Primary)
- **Background**: `#0a0a0f` (near-black) with subtle gradient overlays
- **Surface**: `#12121a` (cards, panels)
- **Border**: `#1e1e2e` (subtle borders)
- **Primary accent**: OKLCH blue-to-cyan gradient (`#3b82f6` → `#06b6d4`)
- **Text primary**: `#f8fafc` (white-ish)
- **Text secondary**: `#94a3b8` (muted)
- **Success**: `#22c55e` (green, for ✅ in comparison)
- **Code background**: `#0d1117` (GitHub-dark terminal style)

### Typography
- **Headings**: System sans-serif stack (Inter / Noto Sans / fallback)
- **Body**: Same sans-serif stack
- **Code / Terminal**: JetBrains Mono (already in project as mono font)
- **All text in English**

### Animation & Effects
- **Scroll-triggered fade-in**: Modules animate in on viewport intersection (CSS `@keyframes` + `IntersectionObserver`)
- **Glass-morphism cards**: `backdrop-filter: blur(12px)` + semi-transparent backgrounds
- **Terminal typing effect**: Code blocks with typewriter animation (CSS-only)
- **Gradient borders**: 1px borders with linear-gradient on hover
- **Particle/grid background**: Lightweight CSS grid pattern on Hero, no heavy JS libraries

### Component Patterns
- **Cards**: Rounded corners (16px), glass-morphism, gradient border on hover
- **Buttons**: Primary (gradient fill), Secondary (ghost/outline), consistent 44px height
- **Code blocks**: Dark terminal style with copy button, syntax highlighting via Shiki (already in deps)
- **Icons**: `@tabler/icons-react` (already in deps) for UI icons; `react-icons/si` for brand logos (Apple, Windows, Linux)
- **Tables**: Clean borders, alternating row backgrounds, check/cross icons for comparison

### Responsive Breakpoints
- **Desktop**: 1280px+ (full layout)
- **Tablet**: 768px-1279px (stacked cards, collapsed sidebar)
- **Mobile**: <768px (single column, hamburger nav)

## 7. Technical Implementation Notes

- **Framework**: Next.js 16 (App Router) — already configured in project
- **Styling**: Tailwind CSS 4 with OKLCH variables — extends existing `src/config/style/theme.css`
- **i18n**: English only for launch (i18n infrastructure exists for future localization)
- **Auth**: Reuse existing `src/core/auth/` (better-auth with Google/GitHub social login)
- **Tutorial content**: MDX files in `content/` directory (Fumadocs already configured)
- **Routing**: Under `src/app/[locale]/` route groups, add new routes for `/download`, `/tutorials/**`, `/team`, `/contact`
- **Platform detection**: Client-side JS using `navigator.platform` and `userAgent`
- **Download links**: Placeholder URLs initially, point to GitHub Releases when available

## 8. Product Constraints

- **Platform**: Web (responsive, mobile-friendly)
- **Language**: All UI text in English
- **Scope boundary**: Portal is marketing + docs only; no HighClaw runtime functionality in the web app
- **Content**: Tutorial content initially based on existing docs (multi-agent-guide.md, build-guide.md, heartbeat-guide.md, system-features-guide.md, README.md); to be expanded iteratively
- **Team profiles**: Fictional — use placeholder avatar images (geometric/abstract), no real photos
- **Download links**: Placeholder `#` URLs for v1.0; will be replaced with actual GitHub Release asset URLs
