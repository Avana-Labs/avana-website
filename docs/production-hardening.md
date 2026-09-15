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

## Release status

Audit and implementation are in progress. No production-readiness claim yet.
