# wwww82 — Cybersecurity Portfolio & Technical Write-up CMS

A modern, high-performance **Cybersecurity Portfolio & Technical Write-up CMS** built for **`wwww82`** (Security Researcher). Features an obsidian cybersecurity aesthetic, interactive terminal hero, structured block write-up engine with syntax highlighting & terminal callouts, comprehensive case studies with severity rating findings, and a zero-code `/admin` CMS.

---

## ⚡ Key Highlights

- **Visual Identity**: Modern Cybersecurity × Minimal Dark UI (`#090B0F` background, `#39FF88` green accent, `#00D9FF` cyan accent, `#10141A` obsidian surfaces).
- **Interactive Terminal Hero**: Real-time shell simulation with commands like `whoami`, `focus`, `status`, `skills`, `certs`, `clear`.
- **Structured Block Write-up Engine**: Author technical research using modular blocks:
  - Syntax-highlighted Code Blocks (bash, python, c, rust, go, sql, etc.)
  - Mock Terminal Execution Blocks (`$ command` -> stdout)
  - Security Warning / Ethical Disclosure Callouts
  - Security Findings with Severity Badges (Critical, High, Medium, Low, Informational)
  - Markdown direct mode toggle with XSS sanitization.
- **Detailed Project Case Studies**: Structured breakdown (Overview, Problem Statement, Objective, Approach, Architecture, Implementation, Security Analysis, Findings, Results, Lessons Learned).
- **Global Command Search (`Ctrl + K`)**: Instant search across Projects, Write-ups, Certifications, and Skills.
- **Comprehensive `/admin` CMS**: Full zero-code content management for Projects, Write-ups, Certifications, Experience, Skills, Tools, Media Uploads, Homepage Sections, Navigation Menus, Theme Palettes, and SEO settings.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ / v22+
- **npm** or **pnpm** / **yarn**

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/wwww82/wwww82-portfolio-cms.git
cd wwww82
npm install
```

### 3. Initialize Database & Seed
Run Prisma database sync and seed with realistic cybersecurity research data:

```bash
# Push schema to SQLite database (dev.db)
npx prisma db push

# Seed initial projects, write-ups, certifications, profile, and navigation
npx tsx prisma/seed.ts
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Admin Credentials

Access the administration portal at [http://localhost:3000/admin](http://localhost:3000/admin):

| Field | Value |
|---|---|
| **Email** | `admin@wwww82.sec` |
| **Password** | `wwww82_admin_pass!2026` |

> [!TIP]
> You can change your password anytime inside **Admin CMS -> Site Settings**.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router, Server Components)
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion
- **ORM & Database**: Prisma ORM with SQLite (local) / PostgreSQL (production)
- **Authentication**: HTTP-only Secure Cookies, JWT (`jose`), Password Hashing (`bcryptjs`)
- **Sanitization & Security**: `sanitize-html`, Zod validation schemas
- **Syntax Highlighting**: Prism.js (C, C++, Rust, Go, Python, Bash, SQL, JS/TS, etc.)

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database connection (SQLite default for local, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# Authentication secret for JWT session encryption
AUTH_SECRET="your_32_character_random_secret_here"

# Next.js Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional Object Storage (AWS S3 / Cloudflare R2 / MinIO)
# Leave empty to use local filesystem storage in public/uploads/
STORAGE_ENDPOINT=""
STORAGE_ACCESS_KEY=""
STORAGE_SECRET_KEY=""
STORAGE_BUCKET=""
STORAGE_REGION="auto"
STORAGE_PUBLIC_URL=""
```

---

## 🌐 Production Deployment Guide

### Deploying to Vercel + PostgreSQL

1. **Setup PostgreSQL Database**:
   - Create a free database on [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres).
   - In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.

2. **Configure Environment Variables in Vercel**:
   - Set `DATABASE_URL` to your PostgreSQL connection string.
   - Set `AUTH_SECRET` to a strong random 32-character string (`openssl rand -base64 32`).
   - Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://wwww82.sec`).

3. **Deploy**:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   npm run build
   ```

---

## 📂 Information Architecture

```
wwww82 CMS
├── Public Routes
│   ├── /                 # Hero with live terminal, DB stats, featured projects & write-ups
│   ├── /about            # About me, philosophy, focus areas, tooling
│   ├── /projects         # Searchable & filterable security project catalog
│   ├── /projects/[slug]  # Case studies with severity findings & remediation
│   ├── /writeups         # Technical write-ups directory with difficulty filters
│   ├── /writeups/[slug]  # Write-up reader with sticky TOC, terminal & code blocks
│   ├── /certifications   # Verified credentials with verification buttons & badges
│   ├── /resume           # Career timeline, categorized skills, tools, PDF download
│   └── /contact          # PGP public key & encrypted inquiry form
│
└── Admin CMS (/admin)
    ├── /admin/login           # Secure credential authentication
    ├── /admin                 # Telemetry metrics, quick actions & revisions log
    ├── /admin/projects        # Create/Edit case studies & findings
    ├── /admin/writeups        # Modular block editor + Markdown mode + live preview
    ├── /admin/certifications  # Manage accreditations & badges
    ├── /admin/profile         # Edit bio, experiences, skills & upload resume PDF
    ├── /admin/media           # Drag-and-drop media library (JPG, PNG, WEBP, PDF)
    ├── /admin/homepage        # Reorder & toggle homepage sections
    ├── /admin/navigation      # Header navigation builder
    ├── /admin/appearance      # Theme presets & live CSS variable tokens
    ├── /admin/seo             # Global SEO & Open Graph meta tags
    └── /admin/settings        # Password update & site configurations
```

---

## 🔒 Security Architecture

- **Zero Arbitrary Execution**: Write-up code and terminal blocks are rendered strictly as text and syntax-highlighted DOM tokens without evaluating client-side JavaScript.
- **Input Sanitization**: All HTML and Markdown payloads are sanitized via `sanitize-html` before rendering.
- **Upload Firewall**: File uploads validate MIME types against an allowlist, enforce strict file-size limits (10MB for images, 20MB for PDFs), and randomize filenames with cryptographic hashes to prevent path traversal.
- **Route Protection**: Admin routes verify HTTP-only signed JWT session cookies server-side on every request.

---

## 📄 License

MIT © 2026 [wwww82](https://github.com/wwww82). All rights reserved.
