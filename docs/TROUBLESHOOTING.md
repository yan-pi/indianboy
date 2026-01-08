# Troubleshooting Guide - Common Issues

## Development Server Issues

### Error: Cannot assign to read only property 'setImmediate'

**Full Error:**

```
TypeError: Cannot assign to read only property 'setImmediate' of object '[object Module]'
```

**Cause:** This error occurs when `initOpenNextCloudflareForDev()` is called unconditionally in `next.config.mjs`.

**Solution:** The error has been fixed by removing the bindings initialization call. The simplified config works correctly:

```javascript
// next.config.mjs
import nextMDX from '@next/mdx'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
})

const nextConfig = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})

export default nextConfig
```

**Note:** Cloudflare bindings are automatically available during `pnpm cf:preview` and in production. You don't need `initOpenNextCloudflareForDev()` for most use cases.

---

## Build Issues

### Build fails with "Module not found"

**Solution:**

```bash
# Clear all caches
rm -rf .next .open-next node_modules
pnpm install
pnpm cf:build
```

### Build succeeds but preview fails

**Check:**

1. Verify `.open-next/worker.js` exists
2. Check wrangler.toml configuration
3. Run with verbose logging:

```bash
pnpm wrangler dev .open-next/worker.js --verbose
```

---

## Deployment Issues

### Error: "Wrangler authentication failed"

**Solution:**

```bash
pnpm wrangler logout
pnpm wrangler login
pnpm cf:deploy
```

### Error: "Worker exceeded size limit"

**Check bundle size:**

```bash
ls -lh .open-next/worker.js
```

**Solutions:**

1. Review dependencies in `package.json`
2. Use dynamic imports for large components
3. Check for duplicate dependencies

---

## Runtime Issues

### Pages load slowly or timeout

**Possible causes:**

1. Missing `nodejs_compat` flag in `wrangler.toml`
2. Large synchronous operations on server
3. Unoptimized database queries

**Check logs:**

```bash
pnpm wrangler tail --status error
```

### Environment variables undefined in production

**Solution:**

1. Verify variables in `wrangler.toml` under `[vars]`
2. For secrets, use:

```bash
pnpm wrangler secret put SECRET_NAME
```

3. Redeploy after adding variables

---

## MDX/Blog Issues

### Blog posts not rendering

**Check:**

1. MDX files in correct location: `app/blog/posts/*.mdx`
2. Frontmatter format is correct
3. No syntax errors in MDX files
4. Run build to see specific errors:

```bash
pnpm build
```

### Math equations not rendering (KaTeX)

**Verify:**

1. `rehype-katex` installed: `pnpm list rehype-katex`
2. KaTeX CSS imported in layout
3. Math syntax correct (use `$` or `$$`)

---

## CI/CD Issues

### GitHub Actions fails to deploy

**Check secrets:**

1. `CLOUDFLARE_API_TOKEN` set correctly
2. `CLOUDFLARE_ACCOUNT_ID` set correctly
3. Token has correct permissions

**Regenerate token:**

1. Cloudflare Dashboard → API Tokens
2. Create new token with "Edit Cloudflare Workers" template
3. Update GitHub Secret

### Build succeeds locally but fails in CI

**Common causes:**

1. Different Node.js versions
2. Missing environment variables
3. Platform-specific dependencies

**Solution:**
Ensure GitHub Actions uses same versions:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.18.0'
```

---

## Preview/Testing Issues

### `pnpm cf:preview` shows old content

**Solution:**

```bash
# Clear build cache
rm -rf .next .open-next
pnpm cf:build
pnpm cf:preview
```

### Preview works but production doesn't

**Differences to check:**

1. Environment variables (`.dev.vars` vs `wrangler.toml`)
2. Different compatibility dates
3. Different Cloudflare regions

**Test in production-like environment:**

```bash
# Build exactly as CI would
pnpm install --frozen-lockfile
pnpm build
pnpm cf:build
```

---

## Performance Issues

### Slow page loads

**Optimize:**

1. Enable R2 caching for ISR
2. Use `<Image>` component for images
3. Implement proper Cache-Control headers
4. Check for N+1 queries

**Monitor:**

```bash
pnpm wrangler tail
```

### High CPU usage warnings

**Solutions:**

1. Reduce synchronous work in server components
2. Use streaming for large responses
3. Implement pagination for large datasets
4. Cache expensive operations

---

## Database/External Services

### Database connection fails

**Remember:**

- Workers have 50ms CPU time limit (free tier)
- Use connection pooling
- Consider edge databases (Cloudflare D1, Turso)

**For PostgreSQL/MySQL:**
Use connection pooling services like PgBouncer or Prisma Data Proxy

---

## Image Issues

### Images not loading

**Check:**

1. Images in `public/` directory
2. Correct paths in `<Image>` component
3. `[images]` binding in `wrangler.toml`

**Test:**

```bash
# Check if image exists
ls -la public/your-image.jpg
```

### Images not optimizing

**Verify:**

1. Using Next.js `<Image>` component (not `<img>`)
2. Width and height specified
3. Cloudflare Images binding configured

---

## Rollback Procedures

### Quick rollback (DNS-based)

If you switched DNS to Cloudflare:

1. Change DNS back to Railway
2. Wait for propagation (5-30 minutes)

### Code rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or deploy specific commit
git checkout <commit-hash>
pnpm cf:deploy
git checkout main
```

### Railway re-enable

If you need to go back to Railway:

1. **Restore `next.config.mjs`:**

```javascript
export default withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  output: 'standalone',
})
```

2. **Redeploy to Railway** using their dashboard

---

## Getting Help

### Before asking for help, collect:

1. **Error message** (full stack trace)
2. **Build logs** (from GitHub Actions or local)
3. **Runtime logs** (`pnpm wrangler tail`)
4. **Configuration** (wrangler.toml, relevant code)
5. **Steps to reproduce**

### Where to ask:

1. **Cloudflare Discord:** [discord.gg/cloudflare](https://discord.gg/cloudflare)
2. **Cloudflare Community:** [community.cloudflare.com](https://community.cloudflare.com)
3. **OpenNext GitHub:** [github.com/opennextjs/opennext/issues](https://github.com/opennextjs/opennext/issues)
4. **Next.js Discord:** [nextjs.org/discord](https://nextjs.org/discord)

---

## Debug Mode

### Enable verbose logging

**Local build:**

```bash
DEBUG=* pnpm cf:build
```

**Wrangler:**

```bash
pnpm wrangler dev .open-next/worker.js --verbose
```

**In code (temporary debugging):**

```javascript
// Add to any server component
console.log('Debug info:', {
  /* your data */
})
```

Then watch logs:

```bash
pnpm wrangler tail
```

---

## Common Quick Fixes

| Issue                | Quick Fix                                  |
| -------------------- | ------------------------------------------ |
| Build fails          | `rm -rf .next .open-next && pnpm cf:build` |
| Deploy fails         | `pnpm wrangler login && pnpm cf:deploy`    |
| Old content showing  | Clear browser cache (Cmd+Shift+R)          |
| Env vars not working | Check `wrangler.toml` and redeploy         |
| Slow preview         | Check if local port 3000 is busy           |
| Images broken        | Verify `public/` directory structure       |

---

**Still having issues?** Check the main `CLOUDFLARE.md` guide or reach out on Cloudflare Discord.
