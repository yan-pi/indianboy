# Advanced Cloudflare Features Setup Guide

This guide covers advanced features for your Cloudflare Workers deployment, including R2 caching, custom domains, and monitoring.

## Table of Contents

1. [R2 Incremental Cache (ISR Support)](#r2-incremental-cache-isr-support)
2. [Custom Domain Setup](#custom-domain-setup)
3. [Image Optimization](#image-optimization)
4. [Monitoring & Analytics](#monitoring--analytics)
5. [Environment Variables & Secrets](#environment-variables--secrets)
6. [Performance Optimization](#performance-optimization)

---

## R2 Incremental Cache (ISR Support)

R2 storage enables Next.js Incremental Static Regeneration (ISR) and on-demand revalidation on Cloudflare Workers.

### Benefits

- ✅ **ISR Support** - Pages can be regenerated in the background
- ✅ **On-Demand Revalidation** - Manually revalidate specific pages
- ✅ **Fast Cache Access** - Low-latency cache reads from R2
- ✅ **Cost Effective** - Free tier: 10GB storage, 1M reads/month

### Setup Steps

#### 1. Create R2 Bucket in Cloudflare Dashboard

1. **Login to Cloudflare Dashboard:**
   - Navigate to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Select your account

2. **Create R2 Bucket:**
   - Go to **R2** in the sidebar
   - Click **Create bucket**
   - **Bucket name:** `portifolio-cache` (or your preference)
   - **Location:** Automatic (recommended)
   - Click **Create bucket**

3. **Note your Account ID:**
   - Find it in the R2 overview page
   - You'll need it for GitHub Actions secrets

#### 2. Update `wrangler.toml`

Uncomment the R2 bucket configuration:

```toml
[[r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "portifolio-cache"  # Use your bucket name
```

**Complete section in `wrangler.toml`:**

```toml
[[r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "portifolio-cache"
```

#### 3. Update `open-next.config.ts`

Uncomment the R2 incremental cache:

```typescript
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
})
```

#### 4. Redeploy

```bash
pnpm cf:deploy
```

#### 5. Verify R2 Cache is Working

After deployment, you can verify R2 is being used:

1. Visit your site and navigate to a blog post
2. Check the Cloudflare R2 dashboard
3. You should see objects being created in your bucket

### Using ISR in Your App

Once R2 is configured, you can use ISR in your Next.js pages:

```typescript
// app/blog/[slug]/page.tsx

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPost({ params }: Props) {
  // Your page code
}
```

Or use on-demand revalidation:

```typescript
// app/api/revalidate/route.ts

import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (!path) {
    return Response.json({ error: 'Missing path' }, { status: 400 })
  }

  revalidatePath(path)

  return Response.json({ revalidated: true, path })
}
```

---

## Custom Domain Setup

Configure your custom domain to point to Cloudflare Workers.

### Prerequisites

- Domain managed by Cloudflare DNS (or can transfer)
- Cloudflare account with Workers deployed

### Setup Steps

#### 1. Add Domain in Cloudflare Workers Dashboard

1. **Navigate to your Worker:**
   - Go to **Workers & Pages**
   - Select `portifolio`

2. **Add Custom Domain:**
   - Click **Settings** → **Domains & Routes**
   - Click **Add Custom Domain**
   - Enter your domain: `indianboy.sh`
   - Click **Add Custom Domain**

3. **Cloudflare will automatically:**
   - Create necessary DNS records
   - Provision SSL certificate
   - Configure routing

#### 2. Update Environment Variable

Update `wrangler.toml`:

```toml
[vars]
SITE_URL = "https://indianboy.sh"
```

#### 3. Redeploy

```bash
pnpm cf:deploy
```

#### 4. Verify

- Visit `https://indianboy.sh`
- Check SSL certificate (should be valid)
- Test all routes

### Using Multiple Domains

You can add multiple domains (www, apex, etc.):

```
indianboy.sh          → Worker
www.indianboy.sh      → Worker
blog.indianboy.sh     → Worker (if desired)
```

Each can be configured separately in the Cloudflare dashboard.

### Subdomain for Staging

Consider setting up a staging environment:

```
staging.indianboy.sh  → Separate Worker for testing
```

---

## Image Optimization

Cloudflare Images provides automatic image optimization.

### Already Configured

Your `wrangler.toml` already includes:

```toml
[images]
binding = "IMAGES"
```

### Using Cloudflare Images

#### Option 1: Automatic (Recommended)

Next.js Image component works automatically with Cloudflare:

```tsx
import Image from 'next/image'

;<Image src="/cover.jpg" alt="Cover" width={1200} height={630} priority />
```

Cloudflare automatically optimizes:

- Format conversion (WebP, AVIF)
- Responsive sizing
- Quality optimization

#### Option 2: Custom Image Loader

Create `lib/cloudflare-image-loader.ts`:

```typescript
export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  return `${src}?${params.join(',')}`
}
```

Update `next.config.mjs`:

```typescript
const nextConfig = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudflare-image-loader.ts',
  },
})
```

### Best Practices

1. **Use Next.js Image Component** - Automatic optimization
2. **Set Priority on Above-Fold Images** - Faster LCP
3. **Use Appropriate Sizes** - Define sizes prop for responsive images
4. **Lazy Load Below-Fold** - Default behavior

---

## Monitoring & Analytics

### Cloudflare Analytics (Free)

Access in Cloudflare Dashboard:

1. **Navigate to Worker:**
   - **Workers & Pages** → `portifolio`

2. **View Metrics:**
   - **Requests** - Total requests over time
   - **Errors** - Error rate and types
   - **CPU Time** - Execution duration
   - **Success Rate** - Percentage of successful requests

3. **Analytics & Logs** Tab:
   - Geographic distribution
   - Status code breakdown
   - Traffic patterns

### Real-Time Logs

#### Using Wrangler CLI

```bash
# Stream all logs
pnpm wrangler tail

# Filter by status
pnpm wrangler tail --status error
pnpm wrangler tail --status ok

# Filter by method
pnpm wrangler tail --method POST

# Sample rate (10% of requests)
pnpm wrangler tail --sampling-rate 0.1
```

#### Log Format

Logs show:

- Timestamp
- HTTP method and path
- Status code
- Execution time
- Any console.log() output

### Custom Analytics

Add custom logging in your app:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()
  const response = NextResponse.next()
  const duration = Date.now() - start

  console.log(
    JSON.stringify({
      path: request.nextUrl.pathname,
      method: request.method,
      duration,
      userAgent: request.headers.get('user-agent'),
    }),
  )

  return response
}
```

### Web Analytics Integration

Your Umami analytics (currently on Railway) will continue to work:

```tsx
// app/layout.tsx (already configured)
<Script
  src="https://umami-production-42f7.up.railway.app/script.js"
  data-website-id="0872e48b-b5cf-4175-be8b-b401a27c7085"
/>
```

Consider migrating Umami to Cloudflare Workers for better performance.

---

## Environment Variables & Secrets

### Types of Variables

1. **Public Variables** - Available at build time and runtime
2. **Secrets** - Encrypted, only available at runtime
3. **Development Variables** - Local development only

### Managing Variables

#### Public Variables (wrangler.toml)

```toml
[vars]
SITE_URL = "https://indianboy.sh"
PUBLIC_API_URL = "https://api.example.com"
```

Access in code:

```typescript
const siteUrl = process.env.SITE_URL
```

#### Secrets (Encrypted)

**Set via CLI:**

```bash
pnpm wrangler secret put DATABASE_PASSWORD
# Prompt will ask for value
```

**Set via Dashboard:**

1. Go to Worker → Settings → Variables
2. Click **Add variable**
3. Select **Encrypt** checkbox
4. Enter name and value

Access in code:

```typescript
const dbPassword = process.env.DATABASE_PASSWORD
```

#### Development Variables (.dev.vars)

Already configured in `.dev.vars`:

```env
NEXTJS_ENV=development
SITE_URL=http://localhost:3000
```

**Add more as needed:**

```env
DATABASE_URL=postgresql://localhost:5432/dev
API_KEY=dev_key_here
```

### GitHub Actions Secrets

Required for CI/CD:

1. **Go to Repository Settings:**
   - Settings → Secrets and variables → Actions

2. **Add Required Secrets:**
   - `CLOUDFLARE_API_TOKEN` - Create in Cloudflare Dashboard
   - `CLOUDFLARE_ACCOUNT_ID` - Found in Cloudflare Dashboard

3. **Creating API Token:**
   - Cloudflare Dashboard → My Profile → API Tokens
   - **Create Token** → **Edit Cloudflare Workers** template
   - Copy token (shown only once)
   - Add to GitHub Secrets

---

## Performance Optimization

### Caching Strategy

#### Static Assets

Already configured in `public/_headers`:

```
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
```

#### Dynamic Content

Use `Cache-Control` headers:

```typescript
// app/blog/[slug]/page.tsx

export default async function BlogPost({ params }: Props) {
  return (
    <article>
      {/* content */}
    </article>
  );
}

export const revalidate = 3600; // 1 hour
```

### Edge Caching

Cloudflare automatically caches at the edge. Optimize with:

1. **Static Generation** - Pre-render pages at build time
2. **ISR** - Regenerate stale pages in background
3. **On-Demand Revalidation** - Update specific pages when content changes

### Bundle Size Optimization

Monitor worker bundle size:

```bash
# Check .open-next/worker.js size
ls -lh .open-next/worker.js
```

**Optimization techniques:**

1. **Dynamic Imports** - Code split large components

   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```

2. **Remove Unused Dependencies** - Audit package.json

   ```bash
   npx depcheck
   ```

3. **Tree Shaking** - Ensure proper imports

   ```typescript
   // Good
   import { specific } from 'library'

   // Bad
   import * as all from 'library'
   ```

### Database Optimization

If using databases:

1. **Connection Pooling** - Reuse connections
2. **Edge Database** - Consider Cloudflare D1 or Turso
3. **Caching** - Cache database queries with R2

### Monitoring Performance

Use Web Vitals:

```typescript
// app/layout.tsx

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

Or use Cloudflare's built-in RUM (Real User Monitoring).

---

## Advanced Worker Configuration

### Custom Limits

Edit `wrangler.toml` for custom limits:

```toml
# CPU time limit (default: 50ms on free plan)
[limits]
cpu_ms = 50

# Max request size (default: 100MB)
[upload]
max_size = 104857600
```

### Multiple Environments

Create environment-specific configurations:

```toml
# Production (default)
name = "portifolio"

# Staging environment
[env.staging]
name = "portifolio-staging"
vars = { SITE_URL = "https://staging.indianboy.sh" }

# Development environment
[env.dev]
name = "portifolio-dev"
vars = { SITE_URL = "https://dev.indianboy.sh" }
```

Deploy to specific environment:

```bash
pnpm wrangler deploy --env staging
```

---

## Next Steps

1. ✅ **Set up R2 bucket** for ISR support
2. ✅ **Configure custom domain**
3. ✅ **Add GitHub Secrets** for CI/CD
4. ✅ **Monitor performance** after deployment
5. ✅ **Optimize images** with Cloudflare Images
6. ✅ **Set up alerts** for errors and downtime

---

## Resources

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Cloudflare Images Docs](https://developers.cloudflare.com/images/)
- [Workers Analytics](https://developers.cloudflare.com/workers/observability/logs/)
- [Next.js ISR Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

---

## Support

For advanced setup help:

- Cloudflare Discord: [discord.gg/cloudflare](https://discord.gg/cloudflare)
- OpenNext GitHub: [github.com/opennextjs/opennext](https://github.com/opennextjs/opennext)
