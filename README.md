# Shayan Batoaq — Engineering Portfolio

My personal engineering portfolio, built with Next.js, React and TypeScript. It presents my work as an early-career **Full-Stack & AI Product Engineer**, with LapSignal as the flagship project and Patricians as evidence of client communication, requirements, development and delivery.

The site is published at [shayan.patricians.pk](https://shayan.patricians.pk). The interface retains its dark blue/purple visual system, animated Three.js background, responsive layouts and accessible work filters.

## Features

- Featured engineering work: LapSignal, Safe Safar / Car Connect, and this portfolio's AI assistant.
- A LapSignal case study with an architecture walkthrough, actual interface captures, engineering details and a clearly identified read-only showcase.
- Separate client work, AI Labs / Experiments, and brand/design categories. The experiments are portfolio prototypes, not claims of production client AI delivery.
- An Ask Me assistant grounded in approved public background and project information.
- Optional Notion conversation logging with signed events, retries, exchange deduplication and usage metadata.
- A section-aware Three.js scene, keyboard-operable filters, mobile navigation, reduced-motion support and a WebGL fallback.
- Project-specific metadata, structured data, a web manifest, sitemap, robots file and a code-generated social preview.

## Stack and architecture

The application uses Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Motion, Three.js / React Three Fiber, Zod, and the Notion JavaScript client. Server-side model calls use OpenRouter's OpenAI-compatible HTTP API.

`src/app/page.tsx` provides structured data and renders the client-side page composition in `App.tsx`. Home sections live in `src/components/home/`, with typed project and experience content in `src/data/`. Reusable navigation, case-study views and the Three.js scene have separate component directories.

LapSignal is a **separate application** described by this portfolio. Its Python/FastAPI backend and telemetry collector do not run inside this repository. The case study is based on the existing project content and screenshots; it does not assert unverified telemetry rates, collector language, hardware tests, test coverage or usage metrics.

### Portfolio AI assistant

1. The browser sends a conversation plus session/exchange identifiers to `POST /api/chat`.
2. The route enforces an in-memory per-request-identity rate limit, a request-size bound and Zod validation. Visitor-supplied system roles are rejected. A bounded recent history is sent to the model.
3. `src/lib/ai/shayan-system-prompt.ts` composes approved context from shared identity, skills, experience, contact and LapSignal data. It distinguishes the internship, client delivery and portfolio prototypes and forbids invented experience.
4. `src/lib/ai/openrouter.ts` calls OpenRouter on the server, validates the response shape and returns controlled errors. The API key is never sent to the browser. Prompt constraints are guidance, not a guarantee that a model will always answer correctly; this is not a RAG implementation.
5. Successful exchanges include an HMAC-signed logging payload. The client stores the conversation and a retry outbox locally. `POST /api/conversations/log` verifies the event before writing to Notion.

The Notion integration stores conversation transcripts, analysis and usage metadata. It resolves the configured database/data source, serializes updates per session within a process, and uses exchange markers to avoid duplicate entries. Logging failures are retried independently of displaying the assistant response. If Notion is not configured, chat still works, but logging cannot complete.

The rate limiter, job store and session queues are process-local. They reset on restart and are not shared across multiple server instances. These are portfolio-level protections, not distributed infrastructure or a claim of production-scale operations. Do not enter secrets or sensitive personal information into the public assistant.

### AI Labs

The existing `/work/ai/[projectId]` routes host Debate Council, Engineering Team, Financial Researcher and Stock Picker. Their current web runtime is TypeScript plus OpenRouter structured-output requests with server-side parsing, model fallback and bounded inputs. The named roles illustrate workflow stages; they are not evidence of independent autonomous agents running in production.

Research workflows try to gather public search evidence and qualify the result when it is unavailable. Generated code and financial research are experimental outputs and require review. The `/api/crews/*` route names are retained for compatibility; no external Python/CrewAI workspace is needed by the current implementation. The run store is in memory, so long-running jobs can be lost on restart or across serverless instances.

### Interactive visual system

`BackgroundScene` loads on the client. `useSectionProgress` and `usePointerParallax` drive the scene states and pointer response; cards, filters, Patricians and chat emit scene reactions. Mobile/low-power devices receive a simplified scene, unavailable WebGL receives a static fallback, and reduced-motion preferences limit movement. Keep `PAGE_SECTION_IDS` in document order when moving sections.

## Local development

Use Node.js 22 LTS and npm. From the repository root:

```sh
npm ci
```

Copy `.env.example` to `.env.local`, then run:

```sh
npm run dev
```

Open `http://localhost:3000`. The static portfolio works without service credentials. Chat and AI Labs need OpenRouter; conversation logging additionally needs a shared Notion database.

## Environment variables

Use placeholders locally and your host's secret settings for deployment. Never commit `.env.local`, and never put a provider key in a `NEXT_PUBLIC_` variable.

| Variable | Purpose |
| --- | --- |
| `OPENROUTER_API_KEY` | Server-only OpenRouter credential, for example `<openrouter-api-key>`. Also used to derive the conversation-event signing secret. |
| `OPENROUTER_MODEL` | Optional chat/workflow model override. The checked-in default is `openai/gpt-5.4-mini`. |
| `OPENROUTER_ENGINEERING_MODEL` | Optional model override for the Engineering Team experiment. |
| `OPENROUTER_WORKFLOW_FALLBACK_MODEL` | Optional fallback for AI Labs. See `.env.example` and `src/lib/crews/runner.ts`. |
| `NOTION_TOKEN` | Server-only Notion integration credential, for example `<notion-integration-token>`. |
| `NOTION_PORTFOLIO_DATABASE_ID` | ID from the conversation database URL, for example `<notion-database-id>`; not its parent page ID. Share the database with the integration. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used in provider request attribution. |
| `NEXT_PUBLIC_SITE_NAME` | Public portfolio name used in provider request attribution. |

Canonical SEO URLs are defined separately in `src/lib/seo.ts`; update that file if the public domain changes. Restart the server after changing environment variables.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npm test
```

The Node integration suite requires a current production build. It starts and stops its own local Next.js server on a free port, supplies a fake credential, and intercepts provider calls with a local fixture. External fetches are blocked in that process, so the tests consume no model credits and do not write to Notion. Tests cover chat success, malformed inputs, provider errors, rate limiting, signed-event tampering and route availability.

These checks do not validate a real model's answer quality or live Notion writes. Use `docs/chat-evaluation.md` for a separate manual model evaluation. Also check desktop/mobile layout, keyboard navigation, work filters, the assistant dialog, image loading and reduced motion after UI changes.

## Content maintenance

- Home/project cards: `src/data/projects.ts` and `src/types/portfolio.ts`.
- LapSignal: `src/data/lapsignal.ts`. Its existing `/work/ai/lapsignal` URL is retained so older links keep working. Add a source action only after a verified source URL is available.
- Screenshots: `public/assets/projects/lapsignal/`; provenance is documented in that directory's README. Preview values are representative, not performance claims.
- Experience: `src/data/experience.ts`; skills and approved background: `src/data/shayan/`.
- Brand work: `src/data/brandSystems.ts` and `public/work/brand-systems/`.
- Resume: replace **`public/Shayan-Batoaq-Resume.pdf`** in place. The download configuration is centralized in `src/data/shayan/resume.ts`. The current PDF has deliberately not been rewritten.
- SEO: `src/lib/seo.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/manifest.ts`, and `src/app/opengraph-image.tsx`.

## Deployment

Build with `npm run build` and run with `npm start` on a Node-capable Next.js host. A static-only export cannot run the chat, logging or lab APIs. Configure server secrets in the deployment environment and confirm the selected provider models are available to the account.

The repository includes existing Sites project configuration in `.openai/hosting.json`; it is retained unchanged. This content/refactor update does not publish a deployment. If deploying on Vercel or another Next.js host, use that host's normal Next.js build/start integration and account for request-duration limits and the process-local lab job store.

## Repository structure

```text
src/
  app/                      Next.js routes, metadata and home composition
    api/chat/               Validated OpenRouter assistant endpoint
    api/conversations/log/  Signed Notion logging endpoint
    api/crews/              Experimental workflow/run endpoints
    work/                   LapSignal, AI Labs and brand case studies
  components/
    home/                   Hero, featured work, capabilities, story and chat
    navigation/             Shared desktop/mobile navigation
    three/                  Interactive scene and fallback
    work/                   Shared case-study and brand components
  data/                     Projects, experience and approved public context
  hooks/                    Pointer and section progress
  lib/ai/                   Prompt, provider client, validation and rate limits
  lib/conversations/        Logging, signing, retries and usage handling
  lib/crews/                Experimental workflow definitions and runtime
  lib/three/                Scene states, layouts and interaction events
  styles/                   Existing visual system and accessibility styles
  types/                    Shared portfolio and conversation types
public/                     Logos, project assets and unchanged resume
tests/                      Isolated HTTP integration tests and provider fixture
docs/                       Manual evaluation and implementation audit
```

Generated build output, local runtime logs, environment files and temporary artifacts are ignored. Third-party component/design acknowledgments remain in `ATTRIBUTIONS.md`.
