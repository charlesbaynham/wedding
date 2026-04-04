# Review Apps Setup

This document explains how review apps (PR previews) are configured for the wedding website using a **subdirectory approach** on GitHub Pages.

## Overview

Review apps allow you to preview changes from pull requests before merging them to master. Each PR gets its own unique URL where the site is deployed as a subdirectory of the main site.

## How It Works

The subdirectory approach works by:

1. **Modifying `baseurl`** → When a PR is opened, the workflow updates `_config.yml` to set `baseurl: "/pr/NUMBER"`
2. **Building with subdirectory** → Jekyll builds all links and assets to use the subdirectory path
3. **Deploying to subdirectory** → The built site is pushed to the `pr/NUMBER/` folder on the `gh-pages` branch
4. **Cleanup on close** → When the PR is closed/merged, the subdirectory is automatically removed

### Example URLs

- Production: `https://wedding.houseabsolute.co.uk/`
- PR #42 Preview: `https://wedding.houseabsolute.co.uk/pr/42/`

## Workflows

### 1. Deploy PR Preview (`.github/workflows/deploy-preview.yml`)

Triggered when a PR is opened or updated:
- Modifies `_config.yml` to set the correct `baseurl` for the PR number
- Builds the Jekyll site
- Deploys to `pr/{number}/` subdirectory on gh-pages branch
- Posts/updates a comment on the PR with the preview URL

### 2. Cleanup PR Preview (`.github/workflows/cleanup-preview.yml`)

Triggered when a PR is closed:
- Removes the `pr/{number}/` directory from gh-pages branch
- Keeps the gh-pages branch clean

### 3. Deploy Production (`.github/workflows/deploy-production.yml`)

Triggered on pushes to master:
- Builds Jekyll with `baseurl: ""` (root)
- Deploys to the root of gh-pages branch

## Requirements

This setup uses GitHub Pages with the `peaceiris/actions-gh-pages` action. No additional secrets are required beyond the built-in `GITHUB_TOKEN`.

## Usage

1. Create a new branch: `git checkout -b my-feature`
2. Make your changes
3. Push and create a PR
4. Wait for the GitHub Action to complete (check the Actions tab)
5. A comment will appear on the PR with the preview link

## Key Differences from Cloudflare Approach

| Feature | Subdirectory (GitHub Pages) | Cloudflare Pages |
|---------|----------------------------|------------------|
| **URL** | Subdirectory of main domain | Separate subdomain |
| **Setup** | Simpler (no extra accounts) | Requires Cloudflare account |
| **Cleanup** | Automatic via workflow | Manual or time-based |
| **Domain** | Same as production | `*.pages.dev` subdomain |

## Troubleshooting

### Preview Not Deploying

Check the GitHub Actions tab for the failed workflow. Common issues:
- Jekyll build errors (check `_config.yml` syntax)
- Permission issues (ensure `GITHUB_TOKEN` has write access)

### Preview URL 404

The GitHub Pages deployment may take 1-2 minutes to propagate. Refresh after a short wait.

### Assets Not Loading

If CSS/images don't load on the preview, check that:
1. The `baseurl` was correctly modified in the workflow
2. The Jekyll build completed successfully
3. Links in templates use `{{ site.baseurl }}` correctly

## Disabling Review Apps

To disable review apps:
1. Delete `.github/workflows/deploy-preview.yml`
2. Delete `.github/workflows/cleanup-preview.yml`

Or disable the workflows in the GitHub Actions settings.
