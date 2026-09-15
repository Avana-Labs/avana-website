# Production hardening

Starting application revision: `4ac86b6` (`codex/quick-fix-dex-cards`).

## Commit policy

Each fix must reproduce a defect or establish a measured improvement, pass its
regression test, preserve unrelated behavior, and pass relevant existing checks.
Do not commit speculative rewrites or relax budgets to obtain a pass. Tooling
improvements count only when tests demonstrate a previously undetected failure.

## Starting checks

- Production build: passed, 1,738 generated pages.
- ESLint, marketing/pricing i18n, docs extraction and docs i18n: passed.
- No automated regression test command existed.
- Fresh npm audit: 29 findings (11 high, 17 moderate, 1 low), pending separation
  of production dependencies from development tools and remediation validation.
- Performance baselines: three runs per representative route, applied DevTools
  throttling, production build. Raw reports remain under ignored `.lighthouse/`.
  Local runs do not establish deployed/CDN behavior or field INP.

## Verified changes

### Audit evidence validation

Eight new negative fixtures passed incorrectly before the fix. All now fail:
empty reports, missing/null LCP, missing profile or throttling provenance,
incomplete route coverage, duplicate routes, and insufficient samples. Valid
evidence still passes; a real budget breach still fails. Ten regression tests
pass. Existing performance budgets are unchanged.

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

The mobile navigation uses a native modal dialog with focus restoration; desktop
navigation and the locale menu now support keyboard open, arrow navigation,
Escape, and focus return. FAQ accordion questions use the correct heading level,
and Privacy Policy subsections no longer skip from `h2` to `h4`. Nested page
wrappers no longer create duplicate main landmarks. The accent text token was
darkened to pass normal-text contrast while the existing shared gray token was
kept consistent. Decorative section activity starts paused until observed and
CTA video does not load for reduced-motion users or data-saver connections.

Source-level regression coverage now includes contrast, animation lifecycle,
navigation metadata identity, Markdown routing, and JSON-LD escaping. The
available browser run passed 8/9 checks before the final modal-focus correction;
the final rerun was blocked by the execution environment's localhost/Chrome
port restrictions, so browser behavior remains an explicit follow-up rather
than a claimed green result.

### Machine-readable route handling

Markdown content negotiation now uses the same public route registry as the
sitemap. Unknown nested paths such as `/borrow/does-not-exist` return a real
404 instead of a fabricated generic 200. Media-type quality values are honored,
so `text/markdown;q=0` does not trigger negotiation. The route registry is
shared by sitemap generation and Markdown handling to prevent drift.

## Release status

Audit and implementation are in progress. No production-readiness claim yet.

## Remaining blockers and limits

- `npm audit` still reports 29 development-tool findings (11 high, 17
  moderate, 1 low); `npm audit --omit=dev` remains clean. The findings are in
  Lighthouse/Chrome test tooling and transitive packages and need a separate
  compatibility-tested dependency commit.
- CI now gates the production dependency surface explicitly with
  `npm run audit:production`. The development-only Lighthouse chain remains a
  separate compatibility item; the audit is not hidden by forcing a major
  Lighthouse downgrade.
- Local Lighthouse evidence is useful for regression comparison but does not
  establish deployed CDN behavior, field INP, or production traffic. The
  original mobile baseline still exceeds existing TBT budgets on Borrow, Lend,
  About, and FAQ, and the home DOM budget; budgets were not loosened.
- Browser HTTP/UI tests require a permitted localhost listener and Chrome
  debugging port. They must be rerun in CI or an approved local environment
  before release sign-off.
- The deployed Vercel headers, analytics behavior, external asset policy, and
  actual production environment variables still require deployment-level
  verification.
