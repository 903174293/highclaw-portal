# 🚀 HighClaw Official Portal

> **High performance. Built for speed and reliability. 100% Go. 100% Agnostic.**

The official website and documentation hub for **HighClaw** — an ultra-high-performance, production-grade AI agent infrastructure built 100% in Go.

## 📋 Project Overview

**HighClaw Portal** is a modern, high-performance web application built with Next.js 16 that serves as the primary marketing, documentation, and community hub for the HighClaw AI agent infrastructure.

### 🎯 Core Purpose

- **Marketing Hub**: Showcase HighClaw's unique value propositions and differentiators
- **Documentation Center**: Comprehensive guides, tutorials, and API documentation
- **Community Platform**: Connect developers, DevOps engineers, and AI enthusiasts
- **Download Center**: Provide easy access to HighClaw binaries and resources

### 👥 Target Users

- Developers and DevOps engineers
- AI enthusiasts and researchers
- Teams migrating from OpenClaw/LangChain/AutoGPT
- Enterprises seeking self-hosted multi-agent solutions

---

## 🏗️ Technology Stack

### Frontend Framework
- **Next.js 16** (App Router) - Modern React framework with server components
- **React 19** - Latest React with improved performance
- **TypeScript 5** - Type-safe development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS with OKLCH variables
- **Radix UI** - Unstyled, accessible component library
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions

### Content & Documentation
- **Fumadocs** - Modern documentation framework
- **MDX** - Markdown with embedded React components
- **next-intl** - Internationalization support

### Backend & Database
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Primary database (configurable: MySQL, SQLite)
- **Better Auth** - Modern authentication with social login (Google, GitHub)

### AI & ML Integration
- **AI SDK** - Unified AI provider interface
- **Multiple AI Providers**:
  - Replicate (image generation, ML models)
  - FAL (fast AI inference)
  - Gemini (Google's AI models)
  - KIE (custom AI provider)

### Additional Libraries
- **React Hook Form** - Efficient form management
- **Zod** - TypeScript-first schema validation
- **Stripe** - Payment processing
- **PayPal SDK** - Alternative payment gateway
- **Embla Carousel** - Accessible carousel component
- **Recharts** - Data visualization

---

## 📁 Project Structure

```
highclaw-portal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalization routes
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── core/                  # Core functionality
│   │   ├── auth/              # Authentication setup
│   │   ├── db/                # Database configuration
│   │   └── i18n/              # Internationalization
│   ├── config/                # Configuration files
│   │   ├── style/             # Theme and styling
│   │   └── db/                # Database schemas
│   ├── shared/                # Shared utilities
│   │   ├── services/          # Business logic
│   │   ├── models/            # Data models
│   │   └── types/             # TypeScript types
│   ├── extensions/            # Extended functionality
│   └── themes/                # Theme configurations
├── content/
│   ├── docs/                  # Documentation (MDX)
│   ├── posts/                 # Blog posts
│   ├── pages/                 # Static pages
│   └── logs/                  # Changelog
├── public/                    # Static assets
├── scripts/                   # Utility scripts
│   ├── deploy.sh             # Deployment script
│   └── server-setup.sh       # Server initialization
└── deployment/               # Deployment guides
    ├── DEPLOYMENT_GUIDE.md   # Complete deployment guide
    ├── QUICK_DEPLOY.md       # 5-minute quick start
    ├── DOCKER_DEPLOY.md      # Docker deployment
    └── ...
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** (recommended: 22.x)
- **pnpm 9+** (package manager)
- **Git** with SSH configured

### Installation

```bash
# Clone the repository
git clone https://github.com/903174293/highclaw-portal.git
cd highclaw-portal

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server with Turbopack
pnpm dev

# Open http://localhost:3000 in your browser
```

### Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Build with increased memory (for large projects)
pnpm build:fast
```

---

## 📚 Available Scripts

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Build & Deployment
- `pnpm build` - Build for production
- `pnpm build:fast` - Build with increased memory
- `pnpm start` - Start production server

### Database
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio

### Authentication
- `pnpm auth:generate` - Generate auth configuration

### Deployment
- `pnpm cf:preview` - Preview Cloudflare deployment
- `pnpm cf:deploy` - Deploy to Cloudflare
- `pnpm cf:upload` - Upload to Cloudflare

---

## 🌐 Deployment

This project supports multiple deployment options:

### 1. Traditional Deployment (Nginx + PM2)
- **Time**: 15-25 minutes
- **Difficulty**: ⭐⭐
- **Guide**: [`QUICK_DEPLOY.md`](./QUICK_DEPLOY.md)

```bash
./scripts/deploy.sh your-server-ip ubuntu
```

### 2. Docker Deployment
- **Time**: 15-25 minutes
- **Difficulty**: ⭐⭐⭐
- **Guide**: [`DOCKER_DEPLOY.md`](./DOCKER_DEPLOY.md)

```bash
docker-compose up -d
```

### 3. Cloud Platform (Vercel, AWS, Google Cloud)
- **Time**: 5-10 minutes
- **Difficulty**: ⭐
- **Guide**: [`DEPLOYMENT_OPTIONS.md`](./DEPLOYMENT_OPTIONS.md)

### Server Setup

For first-time server setup:

```bash
sudo bash scripts/server-setup.sh
```

This will install:
- Node.js 20
- pnpm
- PM2 (process manager)
- Nginx
- Docker (optional)

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/highclaw

# Authentication
BETTER_AUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI Providers
KIE_API_KEY=your-kie-api-key
REPLICATE_API_TOKEN=your-replicate-token
FAL_API_KEY=your-fal-api-key
GEMINI_API_KEY=your-gemini-api-key

# Payment
STRIPE_SECRET_KEY=your-stripe-secret
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret

# Application
APP_URL=https://highclaw.ai
NODE_ENV=production
```

### Database Setup

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Or push schema directly
pnpm db:push
```

---

## 📖 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Quick Deploy](./QUICK_DEPLOY.md)** - 5-minute quick start
- **[Docker Deployment](./DOCKER_DEPLOY.md)** - Docker setup guide
- **[Deployment Options](./DEPLOYMENT_OPTIONS.md)** - Compare deployment methods
- **[Design Specification](./DESIGN_SPEC.md)** - UI/UX design guidelines
- **[Product Requirements](./PRD.md)** - Product specification document

---

## 🎨 Design System

The portal follows a **"Linear Look" dark tech aesthetic** with:

- **Color Scheme**: Deep dark backgrounds with gradient accents
- **Typography**: Inter (body) + JetBrains Mono (code)
- **Icons**: Tabler Icons + React Icons
- **Animations**: CSS-based, lightweight animations
- **Responsive**: Mobile-first design approach

---

## 🔐 Security

- **Authentication**: Better Auth with social login
- **Authorization**: Role-based access control (RBAC)
- **Database**: Encrypted connections, prepared statements
- **API**: Rate limiting, input validation
- **Deployment**: HTTPS/SSL support, security headers

---

## 📊 Performance

- **Framework**: Next.js with Turbopack for fast builds
- **Optimization**: Image optimization, code splitting
- **Caching**: Static file caching, CDN support
- **Monitoring**: Built-in analytics with Vercel Analytics

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is based on ShipAny Template Two. Please respect the original license:

⚠️ **Please do not publicly release ShipAny's Code. Illegal use will be prosecuted.**

See [LICENSE](./LICENSE) for details.

---

## 📞 Support & Feedback

- **Issues**: [GitHub Issues](https://github.com/903174293/highclaw-portal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/903174293/highclaw-portal/discussions)
- **Documentation**: [Deployment Guides](./DEPLOYMENT_INDEX.md)

---

## 🎯 Project Status

- ✅ Core framework setup
- ✅ Authentication system
- ✅ Database integration
- ✅ AI provider integration
- ✅ Documentation framework
- ✅ Deployment automation
- 🚀 Ready for production deployment

---

## 📈 Roadmap

- [ ] Enhanced analytics dashboard
- [ ] Community forum
- [ ] API marketplace
- [ ] Advanced monitoring tools
- [ ] Multi-language support expansion
- [ ] Mobile app

---

**Built with ❤️ for the HighClaw community**
