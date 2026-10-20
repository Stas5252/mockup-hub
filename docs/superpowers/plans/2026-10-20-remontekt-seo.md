# Remontekt SEO Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish useful service pages and fifteen articles, with coherent search metadata, navigation and measurable indexing setup.

**Architecture:** Extend the static site with data-driven editorial pages and a small generator. Keep the landing page and mail handler stable. Export all canonical URLs with one production build.

**Tech Stack:** Node.js, JSON, static HTML/CSS/JS, Python QA, Playwright, REG.RU Apache/PHP existing backend.

**Spec:** docs/superpowers/specs/2026-10-20-remontekt-seo.md

## Global Constraints
- Preserve original photos, landing body copy, mail handler and immutable consent snapshots.
- No invented keyword volumes, portfolio facts, prices or delivery promises.
- Preview noindex; production new pages index, self-canonical and included in sitemap.
- Draft all content locally before publishing; preserve current production rollback.

## Review Focus
- Relative URLs in nested pages and GitHub prefix must remain local and correct.
- Category filters and menu must degrade without JS and handle keyboard input.
- Unknown paths return true 404; generated directories redirect to stable trailing-slash URLs.
- New inline JSON-LD cannot weaken/break the existing CSP.
- Form links must actually open the existing dialog after navigation.

### Task 1: Structure, keyword map and editorial data
- [x] Gather real service evidence and search-intent examples; produce docs/seo keyword map with measured-volume cells empty when access is unavailable.
- [x] Write validation tests for fifteen unique article routes, five service routes, existing images, standalone substantive content, unique headings and related links. Run RED.
- [x] Write services.json and article JSON files with primary references for technical statements; run data validation GREEN.

### Task 2: Templates and production integration
- [x] Write tests for self-canonical, preview/production robots, sitemap exclusions, nested local URLs and CSP hashes. Run RED.
- [x] Implement tools/remont-ekt/seo/generate.cjs exporting generate(site, production) and scriptHashes(site). Add editorial.css/editorial.js and integrate prepare.cjs with sitemap/hash generation.
- [x] Add discoverable links in landing footer and mobile navigation; implement #request dialog entry. Keep main CSS and other landing text unchanged.
- [x] Run generation and tests GREEN, then build production.

### Task 3: Verification and review
- [x] Crawl all generated pages, fragments, local assets and metadata; test filters, navigation and form entry at 320/390/1440, JS/no-JS and normal/reduced motion.
- [x] Compare original landing body except authorized links, assets, form handler and consent hashes. Review content for unsupported claims, duplicated intent and useful photographic context.
- [x] Fresh whole-branch code review, fix important findings, run complete relevant suite.

### Task 4: Hosting and search handoff
- [x] Back up current production and create a new release with all site files and existing proof files. Adapt REG.RU CSP and rewrite rules, enable the release only after checks.
- [x] Verify all public routes and form endpoint. Preserve existing proof files; defer new IndexNow/search submissions and Google/Yandex account setup per latest owner instruction.
- [x] Provide exact owner setup steps for Google/Yandex authentication and measurement baseline; clearly record which tasks require owner sign-in.
