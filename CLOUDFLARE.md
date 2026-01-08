# Cloudflare Workers Deployment Guide

This project is deployed on **Cloudflare Workers** using the `@opennextjs/cloudflare` adapter, which provides full Next.js support on Cloudflare's edge network.

## Architecture

- **Framework:** Next.js 16.1.0 with App Router
- **Runtime:** Cloudflare Workers (workerd)
- **Adapter:** @opennextjs/cloudflare v1.14.8
- **Package Manager:** pnpm 10.16.1
- **Node Version:** 20.18.0

## Features Supported

✅ **Server-Side Rendering (SSR)**  
✅ **Static Site Generation (SSG)**  
✅ **Incremental Static Regeneration (ISR)** (with R2)  
✅ **API Routes**  
✅ **Middleware**  
✅ **Image Optimization** (via Cloudflare Images)  
✅ **Dynamic Routes**  
✅ **MDX with next-mdx-remote**  
✅ **File System Operations** (via nodejs_compat)

## Quick Start

### Development

```bash
# Start Next.js development server
pnpm dev
```

Development server runs at `http://localhost:3000` with full hot-reload support.

### Preview (Cloudflare Workers Runtime)

```bash
# Build and preview in Workers runtime
pnpm cf:preview
```

This builds your app with OpenNext and runs it locally in the Cloudflare Workers runtime (`workerd`). This is the most accurate preview of production behavior.

### Deploy to Cloudflare

```bash
# Build and deploy
pnpm cf:deploy
```

First-time deployment will require authentication:

```bash
pnpm wrangler login
```

## Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start Next.js development server     |
| `pnpm build`      | Build Next.js app (used by OpenNext) |
| `pnpm cf:build`   | Build with OpenNext for Cloudflare   |
| `pnpm cf:preview` | Build and preview in Workers runtime |
| `pnpm cf:deploy`  | Build and deploy to Cloudflare       |
| `pnpm cf:upload`  | Build and upload as version (staged) |
| `pnpm cf:typegen` | Generate TypeScript types for env    |
| `pnpm lint`       | Run ESLint                           |

## Configuration Files

### `wrangler.toml`

Cloudflare Workers configuration file. Key settings:

- **name:** `portifolio` - Your worker name
- **compatibility_date:** `2026-01-08` - Cloudflare compatibility date
- **compatibility_flags:**
  - `nodejs_compat` - Enables Node.js APIs (required for fs operations)
  - `global_fetch_strictly_public` - Allows external URL fetching
- **assets:** Static assets directory (`.open-next/assets`)
- **services:** Self-reference binding for internal requests
- **images:** Cloudflare Images optimization binding
- **vars:** Environment variables

### `open-next.config.ts`

OpenNext adapter configuration. Currently uses default settings. Can be extended with:

- Custom incremental cache (R2)
- Custom image loader
- Custom middleware

### `.dev.vars`

Local development environment variables (not committed to git):

```env
NEXTJS_ENV=development
SITE_URL=http://localhost:3000
```

### `public/_headers`

Static asset caching headers for Cloudflare:

```
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
```

## Environment Variables

### Production Variables

Set in `wrangler.toml` under `[vars]`:

```toml
[vars]
SITE_URL = "https://indianboy.sh"
```

### Local Development Variables

Set in `.dev.vars` (gitignored):

```env
NEXTJS_ENV=development
SITE_URL=http://localhost:3000
```

### Adding New Variables

1. **For local development:** Add to `.dev.vars`
2. **For production:** Add to `wrangler.toml` under `[vars]`
3. **For secrets:** Use `pnpm wrangler secret put <KEY>`

## Advanced Configuration

### Enabling R2 Caching (ISR Support)

1. **Create R2 bucket in Cloudflare dashboard:**
   - Name: `portifolio-cache` (or your choice)
   - Region: Automatic

2. **Uncomment R2 configuration in `wrangler.toml`:**

```toml
[[r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "portifolio-cache"
```

3. **Uncomment R2 cache in `open-next.config.ts`:**

```typescript
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
})
```

4. **Redeploy:**

```bash
pnpm cf:deploy
```

### Custom Domain Setup

1. **Add custom domain in Cloudflare Workers dashboard:**
   - Go to Workers & Pages → portifolio → Settings → Domains & Routes
   - Click "Add Custom Domain"
   - Enter your domain (e.g., `indianboy.sh`)
   - Follow DNS setup instructions

2. **Update `SITE_URL` in `wrangler.toml`:**

```toml
[vars]
SITE_URL = "https://indianboy.sh"
```

3. **Redeploy:**

```bash
pnpm cf:deploy
```

## CI/CD with GitHub Actions

### Setup

1. **Create Cloudflare API Token:**
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create Token → Edit Cloudflare Workers template
   - Copy the token

2. **Add to GitHub Secrets:**
   - Repository → Settings → Secrets and Variables → Actions
   - New repository secret
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: [paste token]

3. **GitHub Action already configured:**
   - See `.github/workflows/deploy-cloudflare.yml` (if exists)
   - Or create one using the template below

### GitHub Action Template

Create `.github/workflows/deploy-cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.16.1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.18.0'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build and Deploy
        run: pnpm cf:deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## Monitoring & Analytics

### Cloudflare Dashboard

- **Workers & Pages** → Select `portifolio`
- **Metrics:** Request count, errors, CPU time
- **Logs:** Real-time logs (Live view)
- **Analytics:** Traffic patterns, geography

### Viewing Logs

```bash
# Stream logs in real-time
pnpm wrangler tail

# Filter errors only
pnpm wrangler tail --status error
```

### Performance

- **Edge Latency:** Sub-50ms globally
- **Cache Hit Rate:** Monitor in analytics
- **Build Time:** ~30-60 seconds
- **Deploy Time:** ~5-10 seconds

## Troubleshooting

### Build Fails

**Error:** Module not found

```bash
# Clear cache and rebuild
rm -rf .next .open-next node_modules
pnpm install
pnpm cf:build
```

**Error:** Next.js 16 not fully supported

This is a warning. Most features work. Monitor for edge cases.

### Preview/Deploy Fails

**Error:** Wrangler authentication failed

```bash
pnpm wrangler login
```

**Error:** Worker exceeded size limit

- Check bundle size in `.open-next/worker.js`
- Consider code splitting or removing large dependencies

### Runtime Errors

**Error:** Module not found in production

- Ensure `nodejs_compat` flag is enabled in `wrangler.toml`
- Check that all imports are bundled correctly

**Error:** Environment variable undefined

- Verify variable is in `wrangler.toml` under `[vars]`
- Redeploy after adding variables

### MDX Not Rendering

- Ensure all MDX plugins are installed
- Check `next.config.mjs` has MDX configuration
- Verify blog posts have correct frontmatter

## Migration Notes

### From Railway

This project was migrated from Railway to Cloudflare Workers:

**Changed:**

- Removed `output: 'standalone'` from `next.config.mjs`
- Added `initOpenNextCloudflareForDev()` call
- Added Cloudflare-specific configuration files

**Kept:**

- All Next.js code unchanged
- Blog system unchanged
- MDX processing unchanged
- Environment variables (migrated to wrangler.toml)

### Rollback to Railway

If needed, revert to Railway:

1. Restore `output: 'standalone'` in `next.config.mjs`
2. Remove `initOpenNextCloudflareForDev()` call
3. Deploy to Railway as before

## Best Practices

### Development Workflow

1. **Local Development:** Use `pnpm dev` for fast iteration
2. **Testing:** Use `pnpm cf:preview` before deploying
3. **Production:** Deploy with `pnpm cf:deploy`
4. **Monitoring:** Check Cloudflare dashboard after deploy

### Performance Optimization

1. **Enable R2 Caching** for ISR support
2. **Use Image Optimization** with Cloudflare Images
3. **Minimize Bundle Size** - review dependencies
4. **Static Assets** - properly configured in `public/_headers`

### Security

1. **API Tokens** - Never commit to git, use GitHub Secrets
2. **Environment Variables** - Use `wrangler secret` for sensitive data
3. **CORS** - Configure if needed for API routes
4. **Rate Limiting** - Monitor and configure if needed

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [OpenNext Cloudflare Docs](https://opennext.js.org/cloudflare)
- [Next.js on Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## Support

For issues or questions:

1. Check this documentation
2. Review [Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
3. Check [OpenNext GitHub](https://github.com/opennextjs/opennext)
4. Cloudflare Discord or Community Forum

## Version History

- **2026-01-08:** Initial Cloudflare Workers deployment
  - Added @opennextjs/cloudflare v1.14.8
  - Added wrangler v4.58.0
  - Migrated from Railway
  - Next.js 16.1.0 support (beta)
