# Review Apps Setup

This document explains how review apps (PR previews) are configured for the wedding website.

## Overview

Review apps allow you to preview changes from pull requests before merging them to master. Each PR gets its own unique URL where the site is deployed.

## How It Works

1. **Pull Request Created** → GitHub Actions builds the Jekyll site
2. **Cloudflare Pages Deploy** → Site is deployed to a unique preview URL
3. **Comment Posted** → Bot comments on the PR with the preview link
4. **Updates on Push** → Every new commit to the PR updates the preview

## Setup Required

To enable review apps, you need to configure Cloudflare Pages:

### 1. Create Cloudflare Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** → **Create a project**
3. Choose **Upload assets** (not Git integration)
4. Name the project: `wedding-website`
5. Note the **Account ID** from the right sidebar

### 2. Create API Token

1. Go to **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use the **Custom token** template:
   - **Token name**: `GitHub Actions - Wedding Site`
   - **Permissions**:
     - `Cloudflare Pages:Edit`
     - `Zone:Read` (if using custom domain)
   - **Account Resources**: Include your account
   - **Zone Resources**: Include your domain (if applicable)

### 3. Add Secrets to GitHub

In the repository, go to **Settings** → **Secrets and variables** → **Actions**, then add:

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | The API token created above |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### 4. Enable Branch Protection (Recommended)

To enforce PR-only changes to master:

1. Go to **Settings** → **Branches**
2. Add rule for `master`:
   - ✅ Require a pull request before merging
   - ⬜ Require approvals (optional)
   - ✅ Require status checks to pass (optional - can add the Jekyll build check)

## Usage

Once configured:

1. Create a new branch: `git checkout -b my-feature`
2. Make your changes
3. Push and create a PR
4. Wait for the GitHub Action to complete
5. Click the preview URL in the PR comments

## Current Limitations

- **Custom Domain**: PR previews use Cloudflare's `*.pages.dev` subdomain, not your custom domain
- **Form Submissions**: RSVP form submissions won't work on previews (no backend)
- **Assets**: Some absolute URLs might reference the production site

## Troubleshooting

### Preview Not Deploying

Check the GitHub Actions tab for the failed workflow. Common issues:
- Missing Cloudflare secrets
- Cloudflare Pages project doesn't exist
- API token lacks correct permissions

### Preview URL 404

Cloudflare Pages may take 30-60 seconds to fully deploy. Wait a moment and refresh.

### Want to Disable?

Simply delete the `.github/workflows/pr-preview.yml` file or disable the workflow in GitHub Actions settings.