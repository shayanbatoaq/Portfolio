# Engineering portfolio update — 17 September 2026

## Scope and baseline

The repository started clean. Its Next.js routes, home page, project/context data, API handlers, assistant validation and logging, scene state logic, shared components, assets, resume references, metadata and build configuration were audited before editing. Baseline lint, TypeScript checking and production build passed. There was an empty `tests/` directory and no configured test command.

The implementation preserves the logo, fonts, dark blue/purple palette, glass surfaces, existing responsive layouts, animated background, project cards, work tabs, case-study routes and broader personal background. It changes content hierarchy and adds engineering evidence using those existing styles.

## Content and hierarchy

The page now leads with the requested Full-Stack & AI Product Engineer identity and engineering CTA. Work immediately follows the hero. LapSignal is a permanent flagship feature above the tabs; Safe Safar and this portfolio assistant are the supporting engineering cards. Technical capabilities and internship experience appear before the three-part About story, Patricians, resume, philosophy and contact.

All nine existing web projects are retained: Safe Safar is featured and the other eight remain under Additional Client Work. All four AI experiments and all five brand case studies remain accessible. Marketing and design now support the engineering story. Motorsport, MMA, entrepreneurship and client delivery remain part of the site.

## Evidence decisions

| Claim or content | Evidence and decision |
| --- | --- |
| LapSignal ingestion, FastAPI, Next.js, WebSockets, deterministic analytics, validation, local-first storage, optional evidence-bounded coaching | Already described in `src/data/lapsignal.ts`; surfaced in the home feature and shared architecture component. |
| LapSignal screenshots and live showcase | Existing assets and URL retained. The read-only preview and representative telemetry limitation remain explicit. |
| LapSignal collector written in Node.js/TypeScript | Both technologies appear in the stack, but the existing content does not establish the collector implementation language. The diagram says Windows collector. |
| 20 Hz, PS4 testing, automated LapSignal tests and Playwright E2E coverage | Not substantiated by the supplied repository; not added. |
| LapSignal source URL | No verified source URL found; no URL or source button invented. |
| Portfolio source link | Taken from the configured Git remote and checked successfully. It is clearly associated with this portfolio, not LapSignal. |
| Safe Safar | Retains the existing Next.js / QR / privacy description. No backend, adoption, deployment-scale or commercial-result claims added. |
| Additional fourth featured engineering project | Not added: the repository did not provide enough technical evidence to justify another project at that level. |
| AI Labs runtime | Current code calls OpenRouter from TypeScript. Removed misleading CrewAI/Claude runtime labels and kept role/stage descriptions framed as prototypes. |
| Engineering experience | Retains early-career status and the September–December 2025 Integrity Technologies internship. No seniority, production AI deployments, metrics or customers invented. |
| Skills | Core engineering first, applied AI second, delivery/testing third and marketing/design supplementary. Removed concept-only framework entries. Newly added automated API tests are real repository evidence; Playwright/OpenAPI claims were not added. |
| Existing client stacks and ownership | Retained the existing descriptions conservatively; this repository does not contain those applications' source code to independently verify their full implementation. |
| Resume | PDF bytes unchanged. Its existing download works; replace `public/Shayan-Batoaq-Resume.pdf` in place or update the shared resume configuration. |

## Structural changes

- Reduced `src/app/App.tsx` from the large combined implementation to page composition and assistant open/close state.
- Extracted Hero, About, FeaturedWork, LapSignalFeature, TechnicalCapabilities, Philosophy, Patricians, Resume, Contact, ProjectCard, AskAssistant and shared reveal/gradient primitives into `src/components/home/`.
- Extracted static project data, experience and the Project type; consolidated resume download configuration.
- Shared LapSignal architecture between the home feature and its existing detail route. Shared experience/skill/project content with the assistant prompt.
- Updated scene section order and initial progress state to follow the new document order.
- Kept legacy `?work=web`, `?work=ai` and `?work=brand` links and existing detail routes; added the featured default and URL-backed tab state.
- Fixed native home anchors, dialog focus trapping/restoration, background inertness, accessible input/send/status labels, small-screen input sizing and reduced-motion transitions.
- Limited brand-card preview loading to its three visible collage slots; every asset remains available in its full case study.

## Repository and documentation

The package and lockfile now use `shayan-batoaq-portfolio`. The README documents architecture, service setup, assistant protections and limitations, Notion logging, the visual system, case-study maintenance, commands and deployment. Obsolete CrewAI workspace environment placeholders were replaced with the actual optional engineering-model variable.

The two generated `.codex-local` server logs were removed from tracking while remaining local. Runtime logs and temporary artifacts are ignored. `.openai/hosting.json`, service configuration and the resume were preserved. Existing third-party attributions remain.

Page metadata, structured data, manifest and social previews now use the engineering positioning. The social preview is generated from code, so it no longer relies on the old image's AI Engineer label. The old static image is retained as an unused asset for compatibility.

## Verification and limits

- Lint, standalone TypeScript checking and production build checked before and after implementation.
- Added six Node HTTP integration tests covering successful chat, invalid/oversized requests, provider failures, request rate limits, tampered signed logging and public routes. The suite uses a local provider fixture and blocks external fetches.
- A real OpenRouter request returned HTTP 200 and accurately described LapSignal as an alpha portfolio project, with representative showcase data and no production client AI claim. No test conversation was submitted to Notion.
- Browser checks cover desktop, 768 px tablet, 390 px mobile and 320 px narrow layouts; featured/default content, keyboard tabs, Show more, retained brand cards, mobile navigation, home/work anchors, assistant focus and Escape behavior, and LapSignal screenshots.
- No horizontal overflow or broken loaded images was observed at those widths. Reduced-motion logic was reviewed in CSS, reveals, filter animations, chat scrolling and the existing Three.js implementation; OS-level reduced-motion emulation was unavailable in this browser session.
- External project links returned successful responses except `https://gwhs.pk`, which returned HTTP 500 on HEAD and GET. LinkedIn rejected automated checks (405/999); its existing URL was retained. Instagram, GitHub, Patricians, LapSignal and the remaining project URLs responded successfully.
- Live Notion persistence was not exercised; signed-event rejection was tested without external writes. The existing logging implementation was preserved.
- Resume Git object hash matches the original. New source/configuration changes were checked for accidental secrets; provider credentials remain in ignored environment files.

## Follow-up decisions

To add a LapSignal source action or stronger testing/performance evidence, provide the public repository URL and supporting implementation/tests. Replace the resume when its separate update is ready. Review the existing Gateway Health Services destination. Publishing the updated portfolio remains a separate action; this task did not deploy it.

## Changed files

```text
.codex-local/dev-server.err.log
.codex-local/dev-server.out.log
.env.example
.gitignore
README.md
docs/chat-evaluation.md
docs/portfolio-update.md
eslint.config.mjs
package-lock.json
package.json
src/app/App.tsx
src/app/layout.tsx
src/app/manifest.ts
src/app/opengraph-image.tsx
src/app/page.tsx
src/app/work/ai/[projectId]/page.tsx
src/app/work/ai/lapsignal/page.tsx
src/app/work/brand-systems/[slug]/page.tsx
src/components/home/About.tsx
src/components/home/AskAssistant.tsx
src/components/home/Contact.tsx
src/components/home/FeaturedWork.tsx
src/components/home/Hero.tsx
src/components/home/LapSignalFeature.tsx
src/components/home/Patricians.tsx
src/components/home/Philosophy.tsx
src/components/home/Primitives.tsx
src/components/home/ProjectCard.tsx
src/components/home/Resume.tsx
src/components/home/TechnicalCapabilities.tsx
src/components/navigation/PortfolioNav.tsx
src/components/work/LapSignalArchitecture.tsx
src/components/work/brand-systems/BrandSystemCard.tsx
src/data/experience.ts
src/data/lapsignal.ts
src/data/projects.ts
src/data/shayan/contact.ts
src/data/shayan/resume.ts
src/data/shayan/skills.ts
src/data/shayan/work.ts
src/hooks/useSectionProgress.ts
src/lib/ai/shayan-system-prompt.ts
src/lib/crews/projects.ts
src/lib/seo.ts
src/lib/three/sceneStates.ts
src/styles/fonts.css
src/types/portfolio.ts
tests/api.test.mjs
tests/fixtures/provider.mjs
```
