# AGENTS.md

## Project shape

- Static, no-build collection of standalone demo pages at the repo root. There is no `package.json`, build, lint, typecheck, or test runner. Verify changes by opening the page directly in a browser (`start index.html`); no local server is required.
- `index.html` is the live ball-game implementation and contains all of its CSS and JS inline. `style.css` and `script.js` are stale split-file artifacts that are no longer referenced; editing them does not affect the game.
- `spec.md`, `plan.md`, and `retrospective.md` describe an earlier version of the ball game and already conflict with the code (e.g. ball size, `refreshBall()`, floating scores). Trust `index.html` over those docs.
- `iconfont-1.html` / `iconfont-2.html` are icon galleries using Font Awesome web fonts vs. Lucide SVGs. `iconfont-3.html` / `iconfont-4.html` are mobile bottom-navigation demos with the same split. Local assets live in `cdn/` and `font/`.
- `starter-level1-tyl-330.html` and `starter-level2-tyl-330.html` are two variants of a student-score dashboard exercise. Both load `data.js`, which exposes `window.STUDENTS` and `window.SUBJECTS`; level 2 implementation variables use `cyr_` prefixes.

## Conventions and constraints

- Pages are opened via `file://`. Do not add `fetch()` calls for local data, ES modules, or a bundler; use classic `<script src>` tags and globals, as `data.js` does.
- New CSS classes, IDs, and JS variables should start with `tyl_` (and CSS custom properties with `--tyl`), per `tyl_prompt.md` record #1. Older files such as `index.html` and `starter-level1-tyl-330.html` predate this rule; match the file locally instead of mass-renaming.
- Every new HTML page must link back to `index.html` (record #3); all existing `iconfont-*.html` pages do.
- `tyl_prompt.md` is an append-only log of user prompts with time, model, and prompt text. Preserve existing records.
- UI copy and docs are Chinese, UTF-8 without BOM. Prefer the file tools; PowerShell console output may show mojibake without the files being corrupt.
- `rules/`, `skills/`, and `superpowers/` are local-only and gitignored (see `.gitignore`). They are not part of the tracked project source. `skills/git-push-project/SKILL.md` documents the required submit flow.

## Submitting changes

- Only when explicitly asked: `git add -A`, commit with `feat:`, `fix:`, `docs:`, or `chore:`, then `git push -u origin main` to the Gitee remote. Do not force-push without confirmation.
- No CI or automated checks exist; manually verify the changed page and its browser console.
