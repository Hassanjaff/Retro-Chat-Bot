# Nokia AI Chatbot

A hyper-realistic retro Nokia phone simulator with a real AI chatbot secretly installed inside it. The UI feels exactly like a classic Nokia 3310 from 2002, while the intelligence is powered by modern OpenAI streaming.

## Run & Operate

- `pnpm --filter @workspace/nokia-chatbot run dev` — run the frontend (uses PORT env)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` — auto-provisioned by Replit AI Integrations

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (conversations + messages tables)
- AI: OpenAI GPT-5.4 via Replit AI Integrations (streaming SSE)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nokia-chatbot/src/pages/NokiaPhone.tsx` — main phone component
- `artifacts/nokia-chatbot/src/components/LcdScreen.tsx` — LCD display
- `artifacts/nokia-chatbot/src/components/Keypad.tsx` — T9 keypad
- `artifacts/nokia-chatbot/src/components/ChatMessages.tsx` — message list
- `artifacts/nokia-chatbot/src/hooks/useT9.ts` — T9 multi-tap logic
- `artifacts/nokia-chatbot/src/hooks/useChat.ts` — conversation + SSE streaming
- `artifacts/nokia-chatbot/src/hooks/useSound.ts` — Web Audio API retro sounds
- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `artifacts/api-server/src/routes/openai/conversations.ts` — chat routes
- `lib/db/src/schema/conversations.ts`, `messages.ts` — DB schema

## Architecture decisions

- AI uses SSE streaming via raw `fetch` + `ReadableStream` (Orval can't generate typed hooks for SSE)
- `useRef` guard in `useChat` prevents `useEffect` from re-firing when mutation hook reference changes
- Google Fonts `@import` must come BEFORE `@import "tailwindcss"` in CSS or PostCSS throws
- OpenAI system prompt tells the AI it lives inside a Nokia phone — keeps responses concise and character-aware
- Conversations persist in PostgreSQL across page reloads

## Product

A single-page app that looks and feels like a real Nokia phone. Users type messages using a T9 multi-tap keypad (or click keys), see responses stream letter-by-letter on a green LCD screen, and hear retro keypad click sounds. The AI maintains full conversation context.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Google Fonts `@import` must precede all Tailwind `@import` statements in `index.css`
- The SSE endpoint `/api/openai/conversations/:id/messages` returns streaming — do NOT use the generated Orval hook for it; use raw `fetch`
- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
