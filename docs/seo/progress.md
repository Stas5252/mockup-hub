# SDD ledger — plan: docs/superpowers/plans/2026-10-20-remontekt-seo.md

Native execution authorized by user: «нужно все сделать чтобы был результат».
Pre-flight: content routes are the interface between templates, metadata, sitemap and QA; one generator owns them.
Ruling: use isolated sibling worktree to avoid modifying repository ignore settings.
Ruling: execute directly under existing authorization; no repeated plan-approval question.
Ruling: no Search Console accounts found in Windsor; do not claim connected dashboards or measured Wordstat volumes.

Task 1: complete — 15 substantive articles, 5 service pages, 61 mapped phrases; data validation RED→GREEN.
Task 2: complete — static templates and production export implemented.
Ruling: inspect sitemap URL values, not XML declaration, for forbidden query strings; original test incorrectly matched the XML opening question mark.
Ruling: defer Google/Yandex account setup and new search submissions per latest user instruction; deliver site changes and readiness instructions now.

Task 2: Ruling: generated CTA anchors point to main contacts without JS; editorial.js upgrades them to #request for normal browser form entry. This preserves a working no-JS path. Verified RED→GREEN in build test.

Task 3: complete — data/build/crawl and browser matrix green; original landing body except authorized anchors, all original photos, PHP and frozen consents preserved. Fresh whole-change review found one Important nested-404 bug. Root-relative resource/home URLs without a base element fix both stylesheet loading and local skip-link navigation. Reproduced RED, browser regression GREEN, covered URL resolution in build.test.cjs. No second reviewer requested.
Ruling: HTTP redirect to HTTPS :443 is the same standard-port origin; preserve working REG native redirect. Protected HOSTING.md correctly returns 403 and path-traversal probes can be denied with 403; neither should be mistaken for an ordinary missing-page failure. Corrected QA assertions without changing product behavior.
Task 4: complete within revised scope — backed up old release locally and on REG.RU; staged new release and switched public_docroot. All 23 live page hashes, enforced CSP JSON-LD hashes, canonical redirects, nested 404, icons, frozen consent and form GET pass. Browser checks pass live at 320/390/1440 and without JS, plus normal-motion form entry on mobile and desktop. No test mail sent during this release. Google/Yandex setup and new submissions explicitly deferred; readiness instructions in docs/seo/README.md.
Ruling: remote main advanced independently with MOBIX Premium only (f0c848e); publish SEO entries on that newer base tree to retain the unrelated work. Shell git fetch currently lacks credentials; use authorized GitHub connector with expected-head lease.
