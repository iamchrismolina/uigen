# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup
npm run setup          # install deps + prisma generate + prisma migrate dev

# Development
npm run dev            # Next.js dev server with Turbopack on localhost:3000
npm run dev:daemon     # Same but backgrounded, logs to logs.txt

# Build & run
npm run build
npm start

# Lint & test
npm run lint
npm run test           # Vitest (all tests)

# Database
npx prisma generate    # Regenerate Prisma client after schema changes
npx prisma migrate dev # Apply migrations
npm run db:reset       # Reset DB (destructive)
```

## Architecture

UIGen is an AI-powered React component generator. Users describe a UI in chat, Claude generates React/Tailwind code, and it renders live in an iframe.

### Data flow

```
User message → ChatContext → POST /api/chat
  → Vercel AI SDK streams Claude response
  → Claude calls str_replace_editor / file_manager tools
  → Tools mutate VirtualFileSystem (in-memory)
  → FileSystemContext notifies PreviewFrame
  → PreviewFrame transforms JSX→JS (Babel standalone) + builds import map
  → Renders App.jsx inside a blob-URL iframe
```

### Key layers

- **`src/app/api/chat/route.ts`** — AI endpoint; receives messages + virtual files, streams back tool calls and text, persists to DB for auth'd users
- **`src/lib/provider.ts`** — Returns Anthropic client (`claude-haiku-4-5`) or a `MockLanguageModel` when `ANTHROPIC_API_KEY` is absent. Also assembles the system prompt context.
- **`src/lib/prompts/generation.tsx`** — System prompt instructing Claude on React/Tailwind generation rules
- **`src/lib/tools/`** — `str-replace.ts` (view/create/str_replace/insert) and `file-manager.ts` (rename/delete) — these are the AI tool definitions
- **`src/lib/file-system.ts`** — `VirtualFileSystem` class: in-memory map of filename→content
- **`src/lib/contexts/`** — `FileSystemContext` and `ChatContext` expose the VFS and chat state to the component tree
- **`src/lib/transform/jsx-transformer.ts`** — Babel-based JSX→CommonJS transform + import map generation for CDN-resolved ESM packages
- **`src/components/preview/PreviewFrame.tsx`** — Renders the virtual `App.jsx` in a sandboxed iframe using blob URLs
- **`src/components/editor/`** — Monaco-based code editor + file tree for browsing/editing virtual files
- **`src/lib/auth.ts`** — JWT session management (jose + bcrypt)
- **`src/actions/`** — Next.js server actions for auth (signUp/signIn/signOut) and project CRUD

### Auth & persistence

- Unauthenticated users get a fully functional but ephemeral session (no DB writes)
- Authenticated users get projects saved to SQLite via Prisma (`prisma/schema.prisma`: `User` + `Project` models)
- Sessions use HTTP-only cookies with JWT (no external auth provider)

### Environment

The only required env var is `ANTHROPIC_API_KEY`. Without it, the app runs in demo mode using `MockLanguageModel`.

## Database schema

The database schema is defined in `prisma/schema.prisma`. Reference it anytime you need to understand the structure of data stored in the database.

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Vercel AI SDK · Prisma/SQLite · Monaco Editor · Vitest + React Testing Library
