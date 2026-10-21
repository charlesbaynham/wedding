# CLAUDE.md

Jekyll wedding site (Charles & Gaby). Pages are bilingual: English in `.label-en` spans, Spanish in `.label-es` spans.

## Every page has a markdown twin for agents — keep them in sync

Each page (`index.html`, `location.md`, `ceremony.md`, `timetable.html`, `activities.html`, `diving.html`, `welcome-party.html`, `rsvp.html`, `rsvp-success.html`) has a plain-markdown version served at `/<page>.md` (`/index.md` for the home page). These are for AI agents.

- Sources: `agents/<page>.txt`, with front matter `permalink: /<page>.md`, `layout: null`, `sitemap: false`. The `.txt` extension stops Jekyll converting the markdown to HTML (Liquid still runs).
- Shared footer: `_includes/contact.md`, which holds the email, the WhatsApp group and links to every `.md` page.
- Shared cenote directions: `_includes/cenote-directions.html` (box on timetable and location) and its twin `_includes/cenote-directions.md`. Edit those, not the pages. `cenote-directions-print.html` lays the same include out as a two-page A4 sheet (English, then Spanish); CI prints it to `/cenote-directions.pdf` with `scripts/build-cenote-pdf.sh` after `jekyll build`, so the PDF always matches the include. That print page has no markdown twin; it is a print source, not a page. Locally: `CHROME=/path/to/chrome scripts/build-cenote-pdf.sh`.
- `_layouts/default.html` puts an HTML comment on the home page that points agents to `index.md`. `_includes/head.html` adds `<link rel="alternate" type="text/markdown">` to every page.

**Rules for any edit:**

1. **Changing page content** (times, prices, venues, links, wording): make the same change in the matching `agents/<page>.txt` in the same commit.
2. **Adding a page:** create `agents/<page>.txt` and link it from `agents/index.txt` and `_includes/contact.md`. If it goes in the nav, update `_config.yml` `navigation` as well.
3. **Removing or renaming a page:** remove or rename its twin and fix every link to it.
4. **Inside the `.md` twins:** link to other pages' `.md` versions, never the HTML ones. Use `{{ '/x.md' | relative_url }}` so PR previews (baseurl `/pr/N`) work. Write in English only, as plain markdown with no HTML or styling.
5. Check with `bundle exec jekyll build` and look at `_site/*.md`.
