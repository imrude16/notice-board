# 📌 Notice Board

A full-stack Notice Board web application built for managing and publishing notices — supporting full Create, Read, Update, and Delete (CRUD) functionality with server-side validation, priority-based sorting, and a responsive UI.

Built as part of a technical assignment to demonstrate full-stack engineering fundamentals: clean architecture, proper API design, real database persistence, and thoughtful engineering trade-offs.

---

## 🔗 Live Demo

**App:** https://your-app.vercel.app
**Repository:** https://github.com/imrude16/notice-board

---

## ✨ Features

- Create, view, edit, and delete notices
- Server-side validation on every write operation (not just client-side)
- Urgent notices automatically sorted to the top — enforced at the **database query level**, not in JavaScript
- Visible **red "Urgent" badge** for high-priority notices
- Delete requires explicit confirmation (accessible modal — focus-trapped, Escape-to-close)
- Optional image field per notice (accepts any external image URL)
- Fully responsive layout — usable on both mobile and desktop
- Loading, empty, and error states handled on the list page
- Reusable form component shared between Create and Edit flows

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (Pages Router) |
| Database ORM | Prisma (v7, using driver adapters) |
| Database | PostgreSQL, hosted on Neon (free tier) |
| Styling | Tailwind CSS |
| Hosting | Vercel (free/Hobby tier) |

---

## 📁 Folder Structure

.
├── components/
│   ├── NoticeCard.js       # Single notice card in the list view
│   ├── NoticeForm.js       # Shared form for both Create and Edit
│   ├── ConfirmDialog.js    # Accessible delete-confirmation modal
│   └── Layout.js           # Shared page header/shell
├── lib/
│   ├── prisma.js           # Single shared Prisma Client instance (with Pg driver adapter)
│   ├── validation.js       # Server-side validation logic, reused across API routes
│   ├── constants.js        # Shared enum values (categories, priorities)
│   └── generated/prisma/   # Auto-generated Prisma Client (via `prisma generate`)
├── pages/
│   ├── api/notices/
│   │   ├── index.js        # GET (list) + POST (create)
│   │   └── [id].js         # GET (single) + PUT (update) + DELETE
│   ├── notices/
│   │   ├── index.js        # Notices list page
│   │   ├── new.js          # Create notice page
│   │   └── [id]/edit.js    # Edit notice page
│   └── index.js             # Redirects to /notices
├── prisma/
│   └── schema.prisma        # Notice model + Category/Priority enums
├── prisma.config.ts         # Prisma 7 config (migrations path, datasource URL)
├── next.config.js
└── styles/globals.css

---

## 🔌 API Endpoints

| Method | Route | Purpose | Success | Failure |
|---|---|---|---|---|
| `GET` | `/api/notices` | List all notices (Urgent-first via Prisma `orderBy`) | `200` | `500` |
| `POST` | `/api/notices` | Create a new notice | `201` | `400`, `500` |
| `GET` | `/api/notices/:id` | Fetch a single notice | `200` | `404`, `500` |
| `PUT` | `/api/notices/:id` | Update an existing notice | `200` | `400`, `404`, `500` |
| `DELETE` | `/api/notices/:id` | Delete a notice | `200` | `404`, `500` |

**Validation rules (enforced server-side, in `lib/validation.js`):**
- `title` and `body` are required and cannot be empty
- `category` must be one of `Exam`, `Event`, `General`
- `priority` must be one of `Normal`, `Urgent`
- `publishDate`, if provided, must be a valid date

---

## 🗄 Database Schema

Priority enum values are declared `Normal` before `Urgent` — Postgres enums sort by declaration order, so `orderBy: { priority: 'desc' }` reliably puts Urgent notices first without any array sorting in JavaScript.

---

## 🚀 Running Locally

1. Clone the repo:
   git clone https://github.com/YOUR_USERNAME/notice-board.git
   cd notice-board

2. Install dependencies:
   npm install

3. Create a `.env` file in the root:
   DATABASE_URL="your-postgresql-connection-string"

4. Generate Prisma Client and run migrations:
   npx prisma generate
   npx prisma migrate dev

5. Start the dev server:
   npm run dev
   Visit http://localhost:3000

---

## 🧪 Testing Validation Directly

Server-side validation was tested independently of the UI, via curl:

curl -X POST http://localhost:3000/api/notices -H "Content-Type: application/json" -d "{\"body\":\"no title\"}"
curl -X POST http://localhost:3000/api/notices -H "Content-Type: application/json" -d "{\"title\":\"t\",\"body\":\"b\",\"category\":\"Nonsense\"}"
curl http://localhost:3000/api/notices/99999

---

## 🔧 One Thing I'd Improve With More Time

The `image` field currently accepts any raw external URL with no validation beyond a browser-level `type="url"` check — a broken or malicious URL would just fail silently as a broken image rather than being caught upfront. With more time, I'd add a proper image-upload flow (e.g. via an object storage service like Cloudinary or Vercel Blob) instead of relying on external hotlinked URLs, plus server-side validation that the URL actually resolves to an image before saving the notice. I'd also add pagination to the notices list — right now it fetches the entire table in one query, which won't scale once there are a large number of notices.

---

## 🤖 Where and How AI Was Used

AI tools (Claude and ChatGPT/Codex) were used throughout the build, primarily as a guided-learning and debugging aid rather than for blind code generation:

- **Understanding the assignment itself** — used AI first to break down the spec's requirements, rules, and grading criteria (REST conventions, server-side validation, DB-level ordering, hard-rejection rules) before writing any code, to make sure I understood what and why, not just how.
- **PostgreSQL, unfamiliar territory** — I had very little prior experience with PostgreSQL specifically (how it's hosted, how connection strings work, how enums behave at the DB level). AI was used to explain these concepts and guide me through setting up a hosted instance (Neon) correctly.
- **Next.js — guided sanity-checking** — I already knew Next.js basics, but used AI as a running sanity-check while building: confirming Pages Router usage was correct, reviewing API route structure, and debugging errors as they came up (e.g. a Prisma 7 architecture change requiring driver adapters that I hadn't encountered before, and a next/image external-hostname restriction when adding the optional image field).
- **Schema and code review** — used AI to review and refine the Prisma schema (e.g. enum ordering for correct Urgent-first sorting), keep components modular (shared NoticeForm for both create/edit, shared validation helper reused client- and server-side), and identify edge cases to test (missing fields, invalid enums, invalid dates, nonexistent IDs) that I might have otherwise missed.
- **Debugging real errors as they happened** — several issues came up mid-build that were specific to Prisma 7's newer config system (prisma.config.ts, custom client output path, the PrismaClientConstructorValidationError requiring a driver adapter) — AI helped diagnose these from actual terminal/build output rather than guessing.

I read and understood every piece of AI-assisted code before committing it — architectural decisions (tech stack choices, folder structure, validation approach, sorting strategy) were made and verified by me, with AI used to sanity-check rather than replace that judgment.
