# Wedding Website - AI Coding Instructions

This is a Jekyll wedding website using the `jekyll-theme-easy-wedding` gem. The project follows a **data-driven, configuration-first** approach with minimal custom code.

## Architecture

**Theme-Based Design:** All layouts, includes, styles, and JavaScript come from the [`jekyll-theme-easy-wedding`](https://github.com/cnorick/jekyll-theme-easy-wedding) gem. Customization happens through:

- YAML data files in `_data/` (couple info, events, FAQs, etc.)
- Configuration in `_config.yml`
- Override files (create `_layouts/`, `_includes/`, `_sass/`, `assets/` to override theme defaults)

**Key Components:**

- **Navigation:** Driven by `_data/navigation.yml`
- **Events:** Main event and celebrations in `_data/events.yml`
- **People:** Wedding party and family in `_data/people.yml`
- **RSVP:** Modal-based form (currently disabled - no backend API configured)
- **Story:** Timeline sections in `_stories/*.md` collection
- **FAQ:** Question/answer pairs in `_data/faq.yml`
- **Registries:** Gift registry links in `_data/registries.yml`

## Development Environment

**Always use Nix:** Run `nix develop` to enter the development shell. This provides:

- Ruby 3.2 with Bundler
- Local gem installation to `.gems/` (avoid system pollution)
- Consistent tooling across all environments

**Never install gems globally.** The Nix flake configures `GEM_HOME=$PWD/.gems`.

## Common Workflows

```bash
# Setup
nix develop                    # Enter Nix shell
bundle install                 # Install gems to .gems/

# Development
bundle exec jekyll serve       # Start dev server at localhost:4000
                               # Auto-rebuilds on file changes

# Production build
JEKYLL_ENV=production bundle exec jekyll build  # Output to _site/

# Update dependencies
bundle update jekyll-theme-easy-wedding         # Update theme
nix flake update                                # Update Nix inputs
```

## Customization Patterns

**Start with the [example folder](https://github.com/cnorick/jekyll-theme-easy-wedding/tree/main/example)** for reference implementations.

**Data-driven content:** Edit YAML files in `_data/` rather than creating custom code:

- `_data/couple.yml` - Couple names (used in nav, headers)
- `_data/events.yml` - Wedding events with dates, locations, attire
- `_data/people.yml` - Wedding party (his_side, her_side, kids, families)
- `_data/faq.yml` - Question/answer pairs
- `_data/registries.yml` - Gift registry links
- `_data/navigation.yml` - Navigation menu items
- `_data/settings.yml` - RSVP text, theme colors, feature toggles (RSVP API currently disabled)

**Override theme files:** To customize theme defaults, create local files with matching names:

- `_layouts/default.html` - Override default layout
- `_includes/nav.html` - Custom navigation
- `_sass/custom.scss` - Additional styles (imported via theme)
- `assets/img/` - Custom images

**Page creation:** Create `.html` files in the root using theme layouts:

```yaml
---
layout: info
title: FAQ
billboard_image: assets/img/photo.jpg
image_position: center center
include: faq.html
---
```

## GitHub Pages Deployment

**Configuration for GitHub Pages:**

- Set `url` in `_config.yml` to your GitHub Pages URL (e.g., `https://username.github.io`)
- Set `baseurl` to your repo name if not using a custom domain (e.g., `/wedding`)
- Current config has both empty, expecting deployment at root domain

**Build process:** GitHub Pages automatically builds Jekyll sites. Ensure:

- No custom plugins outside of theme dependencies
- All files excluded in `_config.yml` won't be deployed
- Image optimization happens during build (can be slow)

## Important Conventions

**Minimal dependencies:** Only add gems when absolutely necessary. This is a simple, theme-driven site.

**Configuration over code:** Prefer YAML data files and theme features over custom HTML/JS/CSS.

**Test locally:** Always run `bundle exec jekyll serve` before pushing to verify changes.

**Respect the theme:** Read [theme documentation](https://github.com/cnorick/jekyll-theme-easy-wedding) before adding custom code. The theme likely has a built-in solution.

**Nix-first workflow:** Always enter `nix develop` before running commands. Don't assume system Ruby.

## File Organization

```
/home/charles/wedding/
├── _config.yml          # Jekyll configuration
├── _data/              # Data-driven content
│   ├── couple.yml
│   ├── events.yml
│   ├── people.yml
│   ├── settings.yml
│   ├── navigation.yml
│   ├── faq.yml
│   └── registries.yml
├── _stories/           # Story timeline sections (create as needed)
├── assets/img/         # Custom images (create as needed)
├── *.html              # Page files (index.html, faq.html, etc.)
└── .gems/              # Local gem installation (gitignored)
```

**Setup complete:** The `_data/` directory has been created with default YAML files. Customize these files to personalize your wedding website. The RSVP feature is currently disabled (no backend API) but the form UI will still render.
