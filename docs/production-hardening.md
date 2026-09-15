# Production hardening

Audit baseline revision: `4ac86b6` (`codex/quick-fix-dex-cards`).
The current branch contains the follow-up fixes described below.

## Commit policy

Each fix must reproduce a defect or establish a measured improvement, pass its
regression test, preserve unrelated behavior, and pass relevant existing checks.
Do not commit speculative rewrites or relax budgets to obtain a pass. Tooling
improvements count only when tests demonstrate a previously undetected failure.

## Current checks

- Production build: passed, 1,739 generated pages.
- `npm test`: passed, 52 tests. ESLint, marketing/UI i18n, docs extraction and
  docs i18n also pass.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- Built SEO and semantics checks: 1,664 rendered pages, 0 failures each.
- Lighthouse comparison evidence exists for the earlier revisions, but a
  complete after-run for the current revision has not been captured. Local
  runs do not establish deployed/CDN behavior or field INP.

## Verified changes

### Audit evidence and Lighthouse metric validation

The validator previously accepted missing raw samples, empty samples, failed raw
runs, and a report whose environment profile did not match its declared profile.
Those fixtures now fail; complete three-run evidence still passes. The runner
also accepts Lighthouse 13's `dom-size-insight` replacement for the removed
`dom-size` audit and retains support for the older audit shape. Existing
performance budgets are unchanged.

The runner now supports desktop/mobile profiles, excludes API routes, preserves
completed evidence, records revision/environment/raw metric samples, and rejects
missing metrics/runtime failures. One-run diagnostics are allowed, but cannot
satisfy the three-run release gate. This improves measurement integrity, not
application performance.

### Locale validation

Nine negative fixtures exposed false passes in the marketing and UI-message
validators. Checks now enumerate the 26 supported locales from the routing
registry, reject missing files, null/blank/non-text entries and stale marketing
groups, and cover every UI namespace (not only Pricing). Thirteen locale fixture
tests pass. The expanded check exposed 75 missing Pricing navigation/metadata
entries and a blank Persian label. Those entries are now translated; five
corrupted renderings of the proper name `Aave ARFC` are normalized. Runtime
fallback behavior is unchanged.

### Brand metadata

Two new regression tests reproduced stale `@dexmini` attribution and a schema
search action pointing at nonexistent `/search`. Metadata now shares Avana's
existing footer identities; Aave's GitHub is no longer claimed as Avana's own.
Removed the unsupported country-only address and nonexistent search action.
JSON-LD escaping remains intact and tested. Three schema tests pass.

### Social previews and localized crawl metadata

The original build had no working `/og` response and rendered canonical/OG URLs
from the English route for localized pages. A static, language-neutral 1200x630
PNG route now serves the existing Avana wordmark without accepting arbitrary
query content or fetching remote assets. Canonical URLs, `og:url`, article
metadata, and developer-document metadata now follow the requested locale.
The sitemap includes the complete public page set, including Copilot routes,
and no longer fabricates a current `lastModified` date. The built audit checks
1,664 rendered locale pages: SEO metadata has 0 failures and landmark/heading
semantics have 0 failures.

### Keyboard access, semantics, contrast, and motion

The restored mobile overlay keeps the original two-bar toggle and visual
treatment while moving focus into the open menu, trapping Tab, and returning
focus to the toggle on Escape. Desktop navigation and the locale menu support
keyboard open, arrow navigation, Escape, and focus return. FAQ accordion
questions use the correct heading level, Privacy Policy subsections no longer
skip from `h2` to `h4`, and nested page wrappers no longer create duplicate main
landmarks. Avana cyan remains `#01AACF`; cyan controls use white text. The CTA
video behavior is restored to its prior near-viewport loading behavior.

Source-level regression coverage now includes contrast, animation lifecycle,
navigation metadata identity, Markdown routing, and JSON-LD escaping. The
browser suite now includes the focus assertion that previously failed in CI.
The local rerun remains blocked by the execution environment's Chrome port
restriction (`listen EPERM`), so runtime browser behavior remains an explicit
CI verification rather than a claimed local green result.

### Font delivery

The global Diatype face remains the only initial font preload. The route-specific
legal italic face is now loaded on demand instead of being preloaded on every
legal page. The built `/en/terms` and `/en/privacy` pages emit one font preload
instead of two; font-display and the selected typefaces are unchanged.

### Machine-readable route handling

Markdown content negotiation now uses the same public route registry as the
sitemap. Unknown nested paths such as `/borrow/does-not-exist` return a real
404 instead of a fabricated generic 200. Media-type quality values are honored,
so `text/markdown;q=0` does not trigger negotiation. The route registry is
shared by sitemap generation and Markdown handling to prevent drift.

## Release status

The static, build, dependency, evidence-validation, and built-page gates are
green. This is not a production-readiness claim yet because final Lighthouse
after-runs, browser CI, and deployment-level checks remain open.

## Remaining blockers and limits

- A final current-revision Lighthouse after-run is still required. Run the
  production build and three applied-DevTools-throttled samples per route in a
  permitted CI environment, then run `npm run lighthouse:check` against that
  output. Do not reuse the incomplete comparison as release evidence.
- Browser HTTP/UI tests require a permitted localhost listener and Chrome
  debugging port. They must be rerun in CI or an approved local environment
  before release sign-off; the local environment currently fails Chrome's
  random-port bind with `EPERM`.
- The deployed Vercel headers, analytics behavior, external asset policy, and
  actual production environment variables still require deployment-level
  verification.
