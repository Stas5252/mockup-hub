# Remontekt SEO completion implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Native execution is authorized by the user's explicit instruction to finish all independent work and defer accounts.

**Goal:** Complete the independent SEO infrastructure in the user's supplied 17-stage brief, preserving the approved website.
**Architecture:** Existing static HTML/CSS/JS + PHP mail handler remain in place. Add a dormant client analytics adapter and a private publication notification CLI; extend existing generators only for metadata and maintainability. No new product dependencies, account creation, paid services or design changes.
**Tech Stack:** Node built-ins, browser JS, existing Python hosting utilities; Playwright/Chromium for QA only.
**Spec:** User's uploaded 17-stage SEO brief, combined with existing no-design/no-visible-copy-change constraint.

## Global constraints
- Preserve visible copy, images, typography, animation and mail/immutable consent behavior.
- No invented company facts, demand volumes, expert attribution, rankings or integration claims.
- Accounts are deferred. Analytics IDs remain null and collection disabled; no pre-consent event queue or personal data.
- Public deployment is authorized; back up before switching releases and retain proof files/private request storage.
- IndexNow may submit canonical public URLs only after live verification. An accepted request is not proof of indexing.

## Review focus
- Failed/duplicate form submission must never count as a successful lead.
- Disabled analytics, denial and preview hosts must generate no third-party requests/storage.
- URL query/fragment/referrer and user form fields must not leak into analytics.
- Unpublished builds, changed remote content and failed IndexNow responses must not become acknowledged state.
- Existing REG proxy HTTPS handling, CSP, frozen consents and verification files must survive release.

### Task 1: Complete audit evidence and metadata
- [x] Read current official search/IndexNow/provider documentation; inspect public competitor service and information pages without asserting unknown traffic/positions.
- [x] Reproduce metadata/date gaps with tests, then add appropriate WebSite metadata and truthful image description; keep original business facts.
- [x] Validate structure with official validators if accessible; record actual warnings, failures and external access limits.

### Task 2: Dormant analytics integration
Files: `mockups/remont-ekt-motion/analytics-config.js`, `analytics.js`, existing `app.js`, generator/head inclusion; `tools/remont-ekt/analytics.test.cjs`.
- [x] RED: browser/VM probes for disabled/no-consent/preview states, allowlisted events, sanitized page URL, success only after backend ok.
- [x] GREEN: config with null provider IDs, explicit in-memory consent, SDK adapter and semantic action hooks. No cookies or storage until a future real consent/provider setup.
- [x] Test failed/successful form flows using intercepted responses, never actual production mail; preserve visible rendering.

### Task 3: IndexNow publication integration
Files: `tools/remont-ekt/publish.cjs`, `publish.test.cjs`, configuration and hosting docs.
Interface: dry-run by default; `--site`, `--state`, `--key-file`, `--submit` after deployment. State outside document root, checksum comparisons, changed/deleted URL list, JSONL results.
- [x] RED: changed/deleted deduplication, live proof and HTML verification, no acknowledgement on HTTP error, private state location and canonical URL validation.
- [x] GREEN: compare sitemap/HTML hashes to state, verify public deployment/proof/status, send IndexNow batch, retain retryable failed/pending state, log no form data.
- [x] Integrate as final release command and submit current unacknowledged public URLs once after deployment.

### Task 4: Deployment, regression, report
- [x] Run source/build/analytics/publication tests and browser/crawl checks; preserve no-JS navigation.
- [x] Export and stage a backed-up REG release; retain proof files, CSP, SSL and private storage; validate live hashes.
- [x] Run live technical checks and bounded Lighthouse comparison; report lab vs field distinction.
- [x] Create `SEO_REPORT.md` with all 17 stage statuses, URL/query/content inventory, actual integration/event tests and unresolved external dependencies; 30/60/90-day measurable plan and account/listing instructions.
- [x] Review diff, publish source safely on current remote head, remove temporary hosting credentials, report concrete completed/deferred work.
