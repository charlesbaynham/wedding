## <!-- Based on: https://github.com/github/awesome-copilot/blob/main/prompts/github-copilot-starter.prompt.md -->

## description: "Repository-wide Copilot instructions for a Jekyll static site."

# Copilot Instructions for Jekyll Static Site

Welcome to the wedding website repository! This project uses [Jekyll](https://jekyllrb.com/) to generate a static site, with custom HTML, CSS, and JavaScript. Please follow these guidelines when using GitHub Copilot:

## General Guidelines

- Use semantic HTML5 elements for structure and accessibility.
- Prefer Liquid templates and includes for reusable content.
- Keep CSS modular and use the existing Bootstrap and Font Awesome assets.
- Write JavaScript in a modular, unobtrusive style; avoid inline scripts.
- Use descriptive commit messages and follow the repository's file structure.

## Jekyll/Liquid

- Use Liquid syntax for templating and data-driven content.
- Place shared components in `_includes/` and layouts in `_layouts/`.
- Use YAML front matter for all pages and posts.

## Content & Assets

- Store images and downloadable assets in a dedicated folder (e.g., `assets/`).
- Reference CSS and JS from the `css/` and `js/` folders.

## Testing & Deployment

- Test site locally with `bundle exec jekyll serve` before pushing changes.
- Ensure the site builds without errors and renders correctly on all major browsers.

## Documentation

- Update `README.md` with any major changes to structure or setup.
- Document any new includes, layouts, or custom scripts.

## Localization (English/Spanish)

To provide English and Spanish content, use the following convention:

- Wrap English text in a `<span>` with class `label-en`.
- Wrap Spanish text in a `<span>` with class `label-es` and add `lang="es"`.
- Place both language spans together in the markup, so users and scripts can toggle or style them as needed.

**Example:**

```html
<span class="label-en">This is the first page</span>
<span class="label-es" lang="es">Esta es la primera página</span>
```

For inline or block content, repeat this pattern. For links or interactive elements, localize the text inside each span as shown in `index.html`.

## Security & Performance

- Avoid inline styles and scripts for better security and maintainability.
- Optimize images and minify CSS/JS where possible.

---

For more detailed instructions, see the files in `.github/instructions/`.
