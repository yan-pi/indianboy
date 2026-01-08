# CI/CD Setup Guide - GitHub Actions

This guide will help you set up automated deployments to Cloudflare Workers on every push to the `main` branch.

## Prerequisites

- ✅ GitHub repository with code pushed
- ✅ Cloudflare account
- ✅ Cloudflare Worker created (done via first manual deploy)

## Setup Steps

### 1. Get Cloudflare API Token

1. **Login to Cloudflare Dashboard:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)

2. **Navigate to API Tokens:**
   - Click your profile icon (top right)
   - Select **My Profile**
   - Click **API Tokens** tab
   - Click **Create Token**

3. **Use Edit Cloudflare Workers Template:**
   - Find **Edit Cloudflare Workers** template
   - Click **Use template**

4. **Configure Permissions:**
   - Should already have correct permissions:
     - Account → Workers Scripts → Edit
     - Account → Account Settings → Read
     - User → User Details → Read

5. **Continue and Create:**
   - Click **Continue to summary**
   - Click **Create Token**
   - **COPY THE TOKEN** (shown only once!)
   - Store it safely (you'll add to GitHub next)

### 2. Get Cloudflare Account ID

1. **In Cloudflare Dashboard:**
   - Go to **Workers & Pages**
   - Click any worker
   - Account ID shown in right sidebar
   - Or check URL: `dash.cloudflare.com/<ACCOUNT_ID>/workers`

2. **Copy your Account ID**

### 3. Add Secrets to GitHub

1. **Go to your GitHub repository:**
   - Navigate to **Settings** → **Secrets and variables** → **Actions**

2. **Add `CLOUDFLARE_API_TOKEN`:**
   - Click **New repository secret**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: [paste the API token from step 1]
   - Click **Add secret**

3. **Add `CLOUDFLARE_ACCOUNT_ID`:**
   - Click **New repository secret**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: [paste your account ID from step 2]
   - Click **Add secret**

### 4. Verify GitHub Action File

The workflow file should already exist at:

```
.github/workflows/deploy-cloudflare.yml
```

If not, it contains:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    # ... deployment steps
```

### 5. Test the Workflow

**Option A: Push to Main**

```bash
git add .
git commit -m "Enable Cloudflare CI/CD"
git push origin main
```

**Option B: Manual Trigger**

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Cloudflare Workers**
3. Click **Run workflow** → **Run workflow**

### 6. Monitor Deployment

1. **Check GitHub Actions:**
   - Go to **Actions** tab
   - Click on the running workflow
   - Watch the deployment progress in real-time

2. **Expected Output:**

   ```
   ✓ Install dependencies
   ✓ Build Next.js app
   ✓ Build with OpenNext
   ✓ Deploy to Cloudflare Workers
   ✓ Create deployment summary
   ```

3. **Deployment Summary:**
   - After success, check the job summary
   - Shows deployment details and link

### 7. Verify Deployment

Visit your site:

- Workers URL: `https://portifolio.YOUR-SUBDOMAIN.workers.dev`
- Custom domain: `https://indianboy.sh` (if configured)

## Workflow Triggers

The workflow runs on:

1. **Push to main branch:**

   ```bash
   git push origin main
   ```

2. **Manual trigger:**
   - GitHub Actions tab → Run workflow

3. **Pull Request merge to main:**
   - Automatically deploys when PR is merged

## Workflow Details

### Environment Variables

Set in the workflow for build time:

```yaml
env:
  SITE_URL: https://indianboy.sh
```

### Deployment Steps

1. **Checkout code** - Fetches repository
2. **Setup pnpm** - Installs package manager
3. **Setup Node.js** - Uses Node 20.18.0 with caching
4. **Install dependencies** - `pnpm install --frozen-lockfile`
5. **Build Next.js** - `pnpm build`
6. **Build with OpenNext** - `pnpm cf:build`
7. **Deploy** - Uses Cloudflare Wrangler Action
8. **Summary** - Creates deployment report

## Troubleshooting

### Error: "Unauthorized" or "Invalid API token"

**Solution:**

1. Verify `CLOUDFLARE_API_TOKEN` is set correctly in GitHub Secrets
2. Check token hasn't expired (regenerate if needed)
3. Ensure token has correct permissions (Edit Cloudflare Workers)

### Error: "Account ID not found"

**Solution:**

1. Verify `CLOUDFLARE_ACCOUNT_ID` is set in GitHub Secrets
2. Check Account ID is correct (no typos)

### Build Fails

**Solution:**

1. Check build logs in GitHub Actions
2. Test build locally: `pnpm cf:build`
3. Ensure all dependencies in package.json
4. Check for environment variable issues

### Deployment Succeeds but Site Shows Old Version

**Solution:**

1. Clear Cloudflare cache:
   ```bash
   pnpm wrangler pages deployment tail
   ```
2. Wait a few minutes for edge cache to update
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

## Advanced Configuration

### Deploy on Pull Request (Preview Deployments)

Add a separate workflow for PR previews:

```yaml
# .github/workflows/preview-cloudflare.yml
name: Preview Deployment

on:
  pull_request:
    branches:
      - main

jobs:
  preview:
    # Similar to deploy but uses different environment
```

### Environment-Specific Deployments

Deploy to staging before production:

```yaml
# Deploy to staging first
- name: Deploy to Staging
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: deploy --env staging
```

### Deployment Notifications

Add Slack/Discord notifications:

```yaml
- name: Notify on success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to Cloudflare successful!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Skip Deployments

Add `[skip ci]` to commit message to skip deployment:

```bash
git commit -m "Update README [skip ci]"
```

## Security Best Practices

1. **Never commit API tokens** - Always use GitHub Secrets
2. **Rotate tokens regularly** - Every 90 days recommended
3. **Use minimal permissions** - Only what's needed
4. **Review token access** - Periodically audit in Cloudflare

## Monitoring Deployments

### GitHub Actions Dashboard

- View all deployments: **Actions** tab
- Filter by status: Success, Failed, Running
- Download logs for debugging

### Cloudflare Dashboard

- View deployments: **Workers & Pages** → portifolio → **Deployments**
- See deployment history
- Rollback if needed

### Deployment Frequency

Current setup deploys on every push to main:

- Typical: 5-10 times per day for active development
- Each deployment takes ~2-3 minutes
- No downtime during deployments

## Next Steps

After CI/CD is working:

1. ✅ **Test a deployment** - Push a small change
2. ✅ **Monitor logs** - Watch first few deployments
3. ✅ **Set up notifications** - Get alerts on failures
4. ✅ **Configure staging** - Optional preview environment
5. ✅ **Document team process** - Share with collaborators

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Cloudflare Wrangler Action](https://github.com/cloudflare/wrangler-action)
- [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)

## Support

Questions? Check:

1. GitHub Actions logs for error details
2. Cloudflare Workers docs
3. This repository's existing workflows
