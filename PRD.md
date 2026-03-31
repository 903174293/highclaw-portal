# Product Requirements Document (PRD)

## 1. Product Overview

- **Product Name**: HighClaw Official Portal
- **Brand Tagline**: `High performance. Built for speed and reliability. 100% Go. 100% Agnostic.`
- **Product Positioning**: The official website for HighClaw — an ultra-high-performance, production-grade AI agent infrastructure built 100% in Go. Out-of-the-box ready with zero install/config overhead. Designed to orchestrate 100+ concurrent agents in a single instance. The portal serves as the primary marketing, documentation, and community hub.
- **Core Differentiators vs OpenClaw**:
  - **Performance**: Go-native vs Node.js — orders of magnitude faster, lower memory footprint, single binary deployment
  - **Scale**: 100+ multi-agent members in a single instance with isolated workspaces, memory, and models
  - **Zero-config**: Download → run → done. No package managers, no dependency chains, no environment setup
  - **Three-Layer Memory**: Industry-first embedded memory system (Session + Notes + SQLite/Embedding) — no Pinecone, no Redis, no Elasticsearch
  - **Model Resilience**: Built-in model failover/disaster recovery — automatic provider switching when primary model fails, ensuring 24/7 agent uptime
  - **12+ Channel Gateway**: Native multi-channel messaging (Telegram, Discord, Slack, WhatsApp, Feishu, WeChat) — one config, all channels
- **Target Users**: Developers, DevOps engineers, AI enthusiasts, teams migrating from OpenClaw/LangChain/AutoGPT, and enterprises seeking self-hosted multi-agent solutions.
- **Core Problem**: HighClaw needs a professional, tech-forward portal to establish brand credibility, showcase its differentiated advantages over OpenClaw and alternatives, and drive GitHub stars, downloads, and community adoption.

## 2. User Analysis

| User Type | Characteristics | Core Need | Scenario |
|:---------:|:---------------:|:---------:|:--------:|
| Individual Developer | Familiar with CLI tools, uses terminal daily, values performance and simplicity | Quick install, understand core value in 30 seconds | Discovers HighClaw via GitHub/HackerNews, visits portal to evaluate |
| DevOps / Infra Engineer | Manages servers, cares about deployment cost and binary size | Deployment guides, platform downloads, security docs | Evaluating self-hosted AI assistant for team |
| OpenClaw Migrator | Current OpenClaw user, frustrated with Node.js overhead, limited agent scale, and lack of model failover | Migration path, comparison table, proof that HighClaw is stronger and faster | Considering switching to Go-based alternative with 100+ agent support and built-in resilience |
| Enterprise Decision Maker | CTO/VP Engineering, evaluates team/security/scalability | Team credentials, security features, multi-agent capabilities | Due diligence before adopting for organization |

## 3. Page Architecture

### 3.1 Page List

| Page Name | Type | Core Function | User Value | Entry Point | Priority |
|:---------:|:----:|:------------:|:----------:|:-----------:|:--------:|
| Landing (Home) | Main page | Brand positioning + core value proposition | Understand HighClaw in 30 seconds | Direct URL / Search | P0 |
| Download | Feature page | Platform-aware binary downloads | Get HighClaw installed immediately | Nav: Download | P0 |
| Tutorials | Feature page | Comprehensive feature module guides | Learn every HighClaw capability | Nav: Tutorials | P0 |
| Blog | Content page | Product updates, technical articles, community news | Stay informed, learn best practices | Nav: Blog / Footer | P1 |
| Team | Info page | Core team profiles | Build trust and credibility | Nav: Team | P1 |
| Contact Us | Feature page | Contact form + social links | Reach the team | Nav: Contact Us | P1 |
| Sign In | Auth page | User authentication | Access gated features | Nav: Sign In | P1 |
| Sign Up | Auth page | User registration | Create account | Nav: Sign Up | P1 |

### 3.2 Navigation Bar

```
Logo | Download | Tutorials | Blog | GitHub(↗) | Team | Contact Us     [ Sign In ] [ Sign Up ]
```

- **Logo**: HighClaw brand mark, links to home
- **Download**: Scrolls to / navigates to download section with auto-detected platform
- **Tutorials**: Opens tutorials hub with sidebar navigation
- **Blog**: Product updates, technical articles, community content
- **GitHub**: External link (opens in new tab) to `https://github.com/HighClawHub/highclaw`
- **Team**: Core team profiles page
- **Contact Us**: Contact form page
- **Sign In / Sign Up**: Right-aligned auth buttons

### 3.3 Footer

**Layout**: 3-column structure — Brand info | Navigation groups | Social links

**Brand Section**:
- HighClaw logo + tagline
- Brief product description

**Navigation Groups**:

| Group | Links |
|:-----:|:-----:|
| About | Features, Docs, GitHub |
| Resources | Blog, Changelog |

**Social Links**:

| Platform | Icon | URL |
|:--------:|:----:|:---:|
| GitHub | Github icon | `https://github.com/HighClawHub/highclaw` |
| Discord | Discord icon | `https://discord.gg/89C8zWz4H` |
| Email | Mail icon | `mailto:contact@highclaw.ai` |

**Legal Links**:
- Privacy Policy (`/privacy-policy`)
- Terms of Service (`/terms-of-service`)

**Bottom Bar**: Copyright © 2025 HighClaw. All rights reserved.

### 3.4 Page Detailed Requirements

---

#### Page 1: Landing (Home) — `/`

- **Page Goal**: Communicate HighClaw's core value in under 30 seconds; drive visitors to Download or GitHub.
- **Design Principle**: Clean, minimal, authoritative. 7 modules, 4-5 scroll screens max. Each module conveys ONE key message with visual support.

**Module 1 — Hero Section**

- **Headline**: `High-Performance AI Agent Infrastructure`
- **Sub-headline**: `High performance. Built for speed and reliability. 100% Go. 100% Agnostic.`
- **Key stats strip** (animated counters below sub-headline): `100+ Agents` | `22+ AI Providers` | `12+ Channels` | `Zero Dependencies`
- **Terminal code block**: `git clone ... && make build && make install && highclaw onboard`
- **Dual CTA**: `[ Get Started ]` (→ Download) `[ View on GitHub ]` (→ GitHub)
- **Visual**: Dark background with subtle particle/grid animation (CSS-only or lightweight canvas), no heavy libraries

**Module 2 — Why HighClaw (6 Advantage Cards)**

Six cards in a 3x2 grid (desktop) / 2x3 (tablet) / 1x6 (mobile), each with icon + title + one-line description:

| Icon | Title | Description |
|:----:|:-----:|:-----------:|
| Rocket icon | Ultra-High Performance | Built 100% in Go. Blazing fast, minimal memory footprint. Outperforms Node.js alternatives by orders of magnitude. |
| Users icon | 100+ Agent Scale | Run 100+ specialized agents in a single instance — each with isolated identity, workspace, model, and memory. |
| Binary icon | Out-of-the-Box Ready | Single binary, zero dependencies. Download → run → done. No package managers, no environment setup needed. |
| Brain/AI icon | 22+ AI Providers | OpenRouter, Anthropic, OpenAI, Ollama, DeepSeek, Gemini, and more. 100% model-agnostic — swap with one config change. |
| Message icon | 12+ Channels | Telegram, Discord, Slack, WhatsApp, Feishu, WeChat — one gateway connects them all. |
| Shield icon | Model Failover & Security | Auto provider switching on failure ensures 24/7 uptime. Plus: sandbox isolation, pairing auth, encrypted secrets. |

**Module 3 — Multi-Agent Architecture (Core Selling Point)**

- **Section title**: `Built for Multi-Agent Collaboration at Scale`
- **One-line**: `Orchestrate 100+ specialized AI agents in a single instance — each with its own identity, workspace, model, and tools. Your AI workforce, one binary.`
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

**Module 5 — Model Failover & Disaster Recovery (Reliability Highlight)**

- **Section title**: `Always-On AI — Model Failover Built In`
- **One-line**: `When your primary model goes down, HighClaw automatically switches to the next provider. Zero downtime, zero manual intervention.`
- **Visual**: Flow diagram showing failover chain:
  ```
  User Message → Primary Model (OpenAI) ──✗ timeout/error
                                           ↓ auto-failover
                 Fallback 1 (Anthropic) ──✗
                                           ↓ auto-failover
                 Fallback 2 (DeepSeek) ──✓ Response delivered
  ```
- **3 sub-highlights** (icon + short text):
  - `Provider Chain Config` — Define failover priority per agent: OpenAI → Anthropic → Ollama → DeepSeek
  - `Per-Agent Model Routing` — Each agent can use a different primary model with its own fallback chain
  - `24/7 Uptime Guarantee` — Automatic retry with exponential backoff, health checks, and graceful degradation

**Module 6 — Comparison Table**

- **Section title**: `How HighClaw Compares`
- **Sub-line**: `Built to outperform. Here's how HighClaw stacks up against the alternatives.`
- **Clean comparison table** with check/cross icons:

| Capability | HighClaw | OpenClaw | LangChain | AutoGPT |
|:----------:|:--------:|:--------:|:---------:|:-------:|
| 100% Go, single binary deployment | ✅ | ❌ (Node.js) | ❌ (Python) | ❌ (Python) |
| 100+ concurrent agents per instance | ✅ | ⚠️ Limited | ❌ | ❌ |
| Out-of-the-box, zero config | ✅ | ❌ | ❌ | ❌ |
| Three-layer memory (no external DB) | ✅ | ❌ | ❌ | ❌ |
| Model failover / disaster recovery | ✅ | ❌ | ❌ | ❌ |
| Multi-agent A2A communication | ✅ | ✅ | ❌ | ❌ |
| 12+ messaging channels built-in | ✅ | ✅ | ❌ | ❌ |
| CJK full-text search | ✅ | ❌ | ❌ | ❌ |
| Sub-agent task delegation | ✅ | ✅ | ❌ | ❌ |
| Zero runtime dependencies | ✅ | ❌ | ❌ | ❌ |
| Cross-platform binary release | ✅ | ❌ | ❌ | ❌ |

**Module 7 — Get Started CTA**

- **Section title**: `Get Started in 3 Steps`
- **Terminal-style code block**:
  ```bash
  # 1. Build
  git clone https://github.com/HighClawHub/highclaw.git && cd highclaw && make build && make install

  # 2. Setup
  highclaw onboard --interactive

  # 3. Chat
  highclaw agent -m "Hello, HighClaw!"
  ```
- **Triple CTA**: `[ Download ]` `[ Star on GitHub ]` `[ Join Discord ]` (→ `https://discord.gg/89C8zWz4H`)

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

**Interaction Details**:
- **Sidebar navigation**: Collapsible category tree with expand/fold per category; current page highlighted; sticky on desktop, drawer on mobile
- **Sidebar search**: Fumadocs built-in search (Ctrl+K shortcut) — full-text search across all tutorial content
- **Code blocks**: One-click copy button (top-right corner), syntax highlighting via Shiki, language label display
- **Anchor navigation**: Auto-generated heading anchors (`#section-name`), smooth scroll on click, URL hash updates for shareability
- **Breadcrumb**: `Home > Tutorials > [Category] > [Article Title]` — always visible at top
- **Previous/Next**: Bottom navigation with article title preview, respects sidebar ordering within the same category

---

#### Page 4: Blog — `/blog`

- **Page Goal**: Publish product updates, technical deep-dives, and community content to drive SEO traffic and user engagement.
- **Core Function**: Blog listing with category filtering + individual article detail pages.
- **Implementation**: Leverages existing ShipAny blog infrastructure (dual data source: local MDX files in `content/posts/` + database posts).

**Blog Listing Page** (`/blog`):
- **Layout**: 3-column card grid, responsive to single column on mobile
- **Card elements**: Featured image, title, description, author avatar + name, publish date
- **Category tabs**: "All" + category-based filtering (e.g., Product, Engineering, Community, Tutorials)
- **Pagination**: Default 30 posts per page

**Blog Detail Page** (`/blog/[slug]`):
- **Layout**: 3-column — Table of Contents (left sticky) | Content (center) | Author info (right sticky)
- **Content features**: Markdown rendering, syntax-highlighted code blocks, auto-generated TOC from headings
- **Navigation**: Breadcrumb (Home > Blog > Article title)
- **SEO**: Dynamic `<title>`, `meta description`, Open Graph tags per article

**Initial Content Categories**:

| Category | Content Direction |
|:--------:|:-----------------:|
| Product | Release notes, feature announcements, roadmap updates |
| Engineering | Architecture deep-dives, performance benchmarks, Go development insights |
| Community | User stories, migration guides, ecosystem highlights |
| Tutorials | How-to articles complementing the Tutorials page |

**Discord CTA**: Each blog post should include a "Join our Discord" banner/link (`https://discord.gg/89C8zWz4H`) to drive community engagement.

---

#### Page 5: Team — `/team`

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

#### Page 6: Contact Us — `/contact`

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
- GitHub: `https://github.com/HighClawHub/highclaw`
- Discord: `https://discord.gg/89C8zWz4H`
- Twitter/X: `@highclaw_ai` (placeholder)

**Form Submission & Backend**:
- **Email delivery**: Via Resend API (already configured in `src/extensions/email/resend.ts`) — form submissions forwarded to team inbox
- **Success feedback**: Inline success toast "Message sent! We'll get back to you within 48 hours." + form reset
- **Error handling**: Inline error toast with retry option; client-side validation before submission (required fields, email format)
- **Anti-spam**: Honeypot field (hidden input, reject if filled) + rate limiting (max 3 submissions per IP per hour via API route). No reCAPTCHA needed for v1 — add if spam becomes an issue
- **Data storage**: No database storage for v1; email-only delivery. Future: store in database for CRM integration

---

#### Page 7 & 8: Sign In / Sign Up — `/sign-in` `/sign-up`

- **Page Goal**: User authentication for future gated features (API keys, cloud dashboard, etc.).
- **Core Function**: Leverage existing better-auth module in the project.
- **Implementation**: Reuse `src/core/auth/` (already supports Google, GitHub social login + email/password).
- **Layout**: Centered card with logo, form fields, social login buttons, and toggle link between Sign In / Sign Up.

---

## 4. User Stories

### P0 Core Features:
- As a **developer**, I want to understand what HighClaw is within 10 seconds of landing on the homepage — its performance advantage, 100+ agent scale, and zero-config setup — so I can decide if it solves my problem.
- As a **developer**, I want to download a single binary and have it running immediately with zero setup, so I can experience the "out-of-the-box" promise firsthand.
- As an **OpenClaw user**, I want to see a clear comparison showing HighClaw's superior performance, model failover, three-layer memory, and 100+ agent scale, so I can justify migrating.
- As a **learner**, I want structured tutorials covering every HighClaw feature, so I can become productive quickly.
- As an **enterprise architect**, I want to understand the model failover/disaster recovery system, so I can trust HighClaw for production 24/7 workloads.

### P1 Important Features:
- As a **developer**, I want to read blog posts about HighClaw's architecture, updates, and best practices, so I can deepen my understanding and stay informed.
- As a **community member**, I want to easily join the Discord community from the website, so I can connect with other users and get support.
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
Tutorials   Blog ←→ Discord(↗)
  ↓         ↓
(14 sub-pages) Team
                ↓
          Contact Us
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
- **Blog**: Leverages ShipAny's existing blog infrastructure — dual data source (local MDX `content/posts/` + database), category filtering, SEO metadata per post
- **Discord**: Community link `https://discord.gg/89C8zWz4H` — used in Footer social links, Contact page, Blog post CTAs, and Landing page Get Started section
- **Download links**: Placeholder URLs initially, point to GitHub Releases when available

## 8. Product Constraints

- **Platform**: Web (responsive, mobile-friendly)
- **Language**: All UI text in English
- **Scope boundary**: Portal is marketing + docs only; no HighClaw runtime functionality in the web app
- **Content**: Tutorial content initially based on existing docs (multi-agent-guide.md, build-guide.md, heartbeat-guide.md, system-features-guide.md, README.md); to be expanded iteratively
- **Team profiles**: Fictional — use placeholder avatar images (geometric/abstract), no real photos
- **Download links**: Placeholder `#` URLs for v1.0; will be replaced with actual GitHub Release asset URLs

## 9. SEO & Meta Strategy

> Leverages existing `src/shared/lib/seo.ts` metadata framework (Open Graph + Twitter Card already supported).

### 9.1 Per-Page Meta Specifications

| Page | `<title>` | `meta description` | OG Image |
|:----:|:---------:|:-------------------:|:--------:|
| Home | `HighClaw — High-Performance AI Agent Infrastructure | 100% Go` | `Ultra-high performance AI agent infrastructure. 100+ agents, 22+ providers, 12+ channels. Out-of-the-box ready, zero dependencies. Built for speed and reliability. 100% Go.` | Hero screenshot / branded OG card |
| Download | `Download HighClaw — macOS, Windows, Linux` | `Download HighClaw for your platform. Single binary, zero runtime dependencies. Available for macOS (Apple Silicon & Intel), Windows, and Linux.` | Platform icons grid |
| Tutorials | `HighClaw Tutorials — Learn Multi-Agent AI Infrastructure` | `Comprehensive guides for HighClaw: multi-agent setup, memory system, channel integration, build & deploy, security, and 60+ CLI commands.` | Tutorial page screenshot |
| Blog | `HighClaw Blog — Updates, Engineering & Community` | `Product updates, architecture deep-dives, and community stories from the HighClaw team.` | Latest blog post image |
| Blog Detail | `{Post Title} — HighClaw Blog` | `{Post description (first 155 chars)}` | Post featured image |
| Team | `Team — HighClaw` | `Meet the team behind HighClaw: engineers from Google Brain, Microsoft Azure, Meta, Anthropic, DeepMind, and Cloudflare.` | Team grid image |
| Contact | `Contact Us — HighClaw` | `Get in touch with the HighClaw team. General inquiries, partnerships, bug reports, and enterprise support.` | Brand card |

### 9.2 Open Graph & Twitter Cards

- **OG type**: `website` (home, download, team, contact), `article` (blog posts, tutorials)
- **Twitter Card**: `summary_large_image` for all pages
- **OG Image**: Default branded card (1200x630px) with HighClaw logo + tagline on dark background; blog posts use their featured image
- **Site name**: `HighClaw`
- **Locale**: `en_US`

### 9.3 Structured Data (JSON-LD)

| Page | Schema Type | Key Properties |
|:----:|:-----------:|:--------------:|
| Home | `SoftwareApplication` | name, description, operatingSystem, applicationCategory, offers (Free) |
| Blog Post | `Article` | headline, author, datePublished, dateModified, image |
| Team | `Organization` | name, url, logo, member[] |
| Download | `SoftwareApplication` + `DownloadAction` | platform-specific entries |
| Tutorial | `TechArticle` | headline, proficiencyLevel, dependencies |

### 9.4 Technical SEO

- **Sitemap**: Dynamic generation via `src/app/sitemap.ts` (replace current static `public/sitemap.xml`); auto-include all blog posts, tutorial pages, and static pages
- **Robots.txt**: Already configured (`src/app/robots.ts`); ensure `/api/*`, `/admin/*`, `/settings/*` are disallowed
- **Canonical URLs**: Locale-aware canonical via existing `getMetadata()` helper
- **Hreflang**: Auto-generated alternate links for `en` (launch); infrastructure ready for future `zh` locale

## 10. Error Pages

### 10.1 404 Not Found — Enhanced

> Base exists at `src/app/not-found.tsx`; enhance with HighClaw branding.

- **Visual**: Dark themed, consistent with site design; HighClaw logo + terminal-style "404" display
- **Message**: `"Page not found. Looks like this agent hasn't been deployed yet."`
- **Actions**:
  - `[ Back to Home ]` primary button
  - `[ View Tutorials ]` secondary button
  - `[ Report on GitHub ]` text link
- **Search**: Optional — inline search bar to help users find what they were looking for

### 10.2 500 / General Error Page

> Create `src/app/[locale]/error.tsx` (client-side error boundary).

- **Visual**: Same dark theme; terminal-style error display
- **Message**: `"Something went wrong. Our agents are looking into it."`
- **Actions**:
  - `[ Try Again ]` button (calls `reset()`)
  - `[ Back to Home ]` fallback link
- **Logging**: Client-side errors captured and sent to analytics (if configured)

## 11. Analytics & Event Tracking

> Leverages existing multi-provider analytics framework (`src/extensions/analytics/`).

### 11.1 Analytics Provider (Recommended)

| Provider | Purpose | Priority |
|:--------:|:-------:|:--------:|
| **Google Analytics 4** | Primary web analytics — traffic, user behavior, acquisition | P0 (launch) |
| **Plausible** | Privacy-friendly alternative — lightweight, no cookie banner needed | P1 (optional) |
| **Vercel Analytics** | Core Web Vitals monitoring (if deploying to Vercel) | P1 (if Vercel) |
| **Microsoft Clarity** | Session recordings & heatmaps for UX optimization | P2 (post-launch) |

**Recommendation**: Start with **Google Analytics 4** for launch — broadest ecosystem, free, and the team is likely already familiar with it. Add Plausible later if privacy compliance becomes a priority.

### 11.2 Key Conversion Events

| Event Name | Trigger | Category |
|:----------:|:-------:|:--------:|
| `download_click` | User clicks any platform download button | Conversion |
| `download_auto_detected` | Auto-detected platform matches user's OS | Engagement |
| `github_click` | User clicks "View on GitHub" or "Star on GitHub" | Conversion |
| `discord_click` | User clicks Discord link (footer, blog, contact) | Community |
| `tutorial_start` | User opens first tutorial page | Engagement |
| `tutorial_complete` | User reaches bottom of tutorial + clicks "Next" | Engagement |
| `contact_submit` | Contact form successfully submitted | Conversion |
| `signup_complete` | User completes registration | Conversion |
| `signin_complete` | User signs in | Engagement |
| `comparison_view` | User scrolls to comparison table (viewport intersection) | Engagement |
| `cta_hero_click` | User clicks hero CTA buttons | Conversion |
| `blog_read` | User spends 30+ seconds on blog post | Engagement |

### 11.3 Implementation

- Configure GA4 Measurement ID via admin settings panel (key: `google_analytics_id`)
- Custom events fired via `window.gtag('event', ...)` or ShipAny's `analytics.track()` service
- All event tracking code in a shared utility: `src/shared/lib/analytics-events.ts`

## 12. Performance Targets

### 12.1 Core Web Vitals Goals

| Metric | Target | Measurement |
|:------:|:------:|:-----------:|
| **LCP** (Largest Contentful Paint) | < 2.5s | Hero section fully rendered |
| **FID** (First Input Delay) | < 100ms | First button click responsive |
| **CLS** (Cumulative Layout Shift) | < 0.1 | No layout jumping on load |
| **FCP** (First Contentful Paint) | < 1.8s | First text/image visible |
| **TTFB** (Time to First Byte) | < 800ms | Server response time |

### 12.2 Lighthouse Score Targets

| Category | Target Score |
|:--------:|:-----------:|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

### 12.3 Optimization Strategy

- **Images**: Next.js `<Image>` component with automatic WebP/AVIF conversion; lazy loading for below-fold images; explicit `width`/`height` to prevent CLS
- **Fonts**: `next/font` for Inter and JetBrains Mono — subset loading, `font-display: swap`, preload critical weights only (400, 600, 700)
- **Code splitting**: Next.js App Router automatic code splitting per route; dynamic import for heavy components (particle animations, comparison table)
- **CSS**: Tailwind CSS purging unused styles; critical CSS inlined by Next.js
- **Caching**: Static pages via ISR (Incremental Static Regeneration); blog posts revalidate every 1 hour; tutorial pages static at build time
- **Bundle monitoring**: `@next/bundle-analyzer` (already configured) — run with `ANALYZE=true` before releases to catch regressions

## 13. Content Update Mechanism

### 13.1 Tutorial Content Updates

| Aspect | Strategy |
|:------:|:--------:|
| **Source of truth** | HighClaw core repo docs (`multi-agent-guide.md`, `build-guide.md`, etc.) |
| **Sync workflow** | Manual: copy updated docs → convert to MDX → place in `content/` directory → deploy |
| **Update frequency** | Sync with each HighClaw major/minor release |
| **Versioning** | Tutorial content tagged with HighClaw version (e.g., "Updated for v1.2.0") at top of each page |
| **Review process** | Content PR → review for accuracy → merge → auto-deploy |

### 13.2 Version Number Sync (Download Page)

| Aspect | Strategy |
|:------:|:--------:|
| **Current approach** | Version hardcoded in page config (`v1.0.0`) |
| **Recommended v1** | Environment variable `NEXT_PUBLIC_HIGHCLAW_VERSION` set at build/deploy time |
| **Recommended v2** | GitHub API call (`/repos/HighClawHub/highclaw/releases/latest`) at build time via `getStaticProps` / ISR — auto-fetches latest release tag, asset URLs, and changelog |
| **Download URLs** | Pattern: `https://github.com/HighClawHub/highclaw/releases/download/v{version}/highclaw-{platform}-{arch}.tar.gz` |
| **Revalidation** | ISR revalidate every 1 hour — new releases appear within 1 hour without manual redeploy |

### 13.3 Blog Content Updates

| Aspect | Strategy |
|:------:|:--------:|
| **Local posts** | MDX files in `content/posts/` — git-based workflow (PR → merge → deploy) |
| **Database posts** | Admin panel → create/edit post → instant publish (no deploy needed) |
| **Recommendation** | Use database posts for time-sensitive content (release notes, announcements); MDX for evergreen technical articles |
