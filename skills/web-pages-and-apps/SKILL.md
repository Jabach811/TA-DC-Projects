---
name: web-pages-and-apps
description: Use when the user wants new web pages, redesign concepts, standalone HTML apps, intake pages, dashboards, or UX improvements for existing websites and internal tools. Especially useful for multi-file HTML/CSS/JS work, alternate design directions, app-like checklist tools, and polished landing pages with strong visual direction.
---

# Web Pages And Apps

Use this skill for browser-based builds where the output is a webpage, microsite, standalone HTML tool, or internal web app.

## When To Use

Use this skill when the user asks for:
- a new webpage, landing page, intake form, or microsite
- redesign concepts or multiple visual variants
- a standalone HTML app experience instead of a page embedded in another site
- dashboard views built from real app state or saved browser data
- UX improvements inside an existing HTML/CSS/JS app

Do not use this skill for:
- backend-only tasks
- CLI tools
- generic copywriting with no web output

## Default Approach

1. Identify whether this is:
   - a brand-new page/site
   - a redesign variant
   - an enhancement to an existing app
2. Preserve existing structure and content unless the user explicitly asks to change it.
3. If the user wants options, create separate files instead of overwriting the original.
4. Prefer standalone HTML outputs when the project is local and self-contained.
5. When adding dashboards or summaries, use the app's actual saved data and current state instead of inventing placeholder metrics.
6. When doing any kind of design work, use Front End Skills to guide layout, styling, motion, and visual polish.

## Design Rules

- Use Front End Skills for any design-related work.
- Avoid generic UI. Pick a clear visual direction.
- Keep typography intentional. Do not fall back to bland default styling.
- Build atmosphere with gradients, contrast, shapes, bands, or layered panels instead of flat empty backgrounds.
- Add slight load-in motion when it helps orientation, but keep it restrained.
- Make layouts work on desktop and mobile.
- For official intake or business-facing pages, bias toward polished, structured, credible presentation.
- For internal tools, bias toward clarity first, then visual refinement.

## Visual Verification

- When making cosmetic or layout changes, capture local screenshots of the actual result before finalizing.
- Review the screenshots yourself and confirm spacing, alignment, hierarchy, and obvious rendering issues instead of assuming the code is correct.
- If the screenshot reveals a mismatch, fix it and re-check with another screenshot.
- Delete temporary screenshot files after verification unless the user explicitly wants them kept.
- Mention any screenshot tooling limitation if the environment cannot render the page faithfully.

## Variant Rules

If the user asks for multiple concepts:
- create separate files
- keep structure/content consistent across variants unless asked otherwise
- vary theme, color system, layout treatment, and motion language
- do not collapse all variants into one average design

## Existing App Rules

When working inside an existing HTML app:
- keep existing logic unless the user asked for behavior changes
- extend current save/load/state systems instead of duplicating them
- if a new view needs metrics, derive them from real local state, saved records, or existing checklist/task data
- if a tool should feel app-like, prefer direct-open / bookmarkable behavior

## Dashboard Rules

When adding a dashboard:
- summarize real items already present in the app
- include current live state if it exists
- include saved browser state if the app already stores it
- show useful rollups such as status, completion, counts, mix, and recent activity
- make the dashboard feel like part of the product, not an admin afterthought

## Export Rules

If the user wants formatted Excel output:
- do not use plain CSV if styling is required
- use an Excel-friendly HTML table export or another format that supports styling
- style headers, borders, alignment, and column sizing lightly
- keep exports clean and practical rather than overdesigned

## Recommended Deliverables

Depending on request, prefer one of:
- one new standalone `.html` file
- one original file plus multiple concept copies
- a small set of linked pages for a microsite
- a dashboard added to an existing app

## References

- For specific visual and implementation patterns, read `references/patterns.md`.
