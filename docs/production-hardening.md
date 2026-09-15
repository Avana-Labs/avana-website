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

## Release status

Audit and implementation are in progress. No production-readiness claim yet.
