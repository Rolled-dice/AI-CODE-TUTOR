# AI Coding Tutor — System Instructions

A Chrome side-panel extension that watches LeetCode / Codeforces problems and
streams Socratic hints from a Spring Boot backend powered by Claude.

## Architecture

```
[ Site DOM ] -> content/scraper.ts -> background/service-worker.ts (cache)
                                            |
                                            v
                                   sidebar (React) ---fetch---> Spring Boot
                                                                    |
                                                                    v
                                                              Anthropic API
```

- **extension/** — Vite 5 + React 18 + TS + Tailwind v3
  - `background/` — MV3 service worker. Owns side panel + per-tab problem cache.
  - `content/` — Scrapes problem context. `SiteAdapter` registry routes by host.
  - `sidebar/` — Native Chrome side panel UI. Talks to backend over `fetch`.
- **backend/** — Java 17 + Spring Boot 3 + Maven
  - `controller/HintController` — POST `/api/hint`
  - `service/ClaudeService` — Anthropic Messages API client
  - `config/CorsConfig` — Allows the extension origin

## Task States

- `idle` — no problem detected
- `scraping` — adapter is reading DOM
- `ready` — context cached, awaiting user prompt
- `streaming` — backend is streaming hint tokens
- `error` — last action failed; user can retry

## Behavioral Guidelines (LLM)

1. **Think before coding.** Surface assumptions. Ask when unclear.
2. **Simplicity first.** Minimum code. No speculative abstractions.
3. **Surgical changes.** Touch only what the task requires.
4. **Goal-driven.** Define verifiable success criteria; loop until met.

## Local Dev

```bash
# Backend
cd backend
ANTHROPIC_API_KEY=sk-... mvn spring-boot:run

# Extension
cd extension
npm install
npm run build       # produces dist/ — load unpacked in chrome://extensions
```
