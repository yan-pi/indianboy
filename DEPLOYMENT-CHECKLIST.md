# Cloudflare Deployment Checklist

Use this checklist to ensure a smooth deployment to Cloudflare Workers.

## 📋 Pre-Deployment Checklist

### Local Testing

- [ ] Run `pnpm dev` - Development server works
- [ ] Run `pnpm build` - Next.js builds without errors
- [ ] Run `pnpm cf:build` - OpenNext build succeeds
- [ ] Run `pnpm cf:preview` - Workers runtime preview works
- [ ] Test all major pages (home, blog, individual posts)
- [ ] Test RSS feed at `/rss.xml`
- [ ] Verify images load correctly
- [ ] Check MDX rendering (math, code, diagrams)
- [ ] Test theme switching (light/dark)
- [ ] Verify animations work smoothly
- [ ] Check mobile responsiveness
- [ ] No console errors in browser

### Configuration Files

- [ ] `wrangler.toml` - Worker name and settings configured
- [ ] `open-next.config.ts` - OpenNext config created
- [ ] `.dev.vars` - Local environment variables set
- [ ] `public/_headers` - Caching headers configured
- [ ] `.gitignore` - Cloudflare files excluded
- [ ] `package.json` - All Cloudflare scripts added

## 🚀 First Deployment

### Cloudflare Setup

- [ ] Cloudflare account created
- [ ] Authenticated with `pnpm wrangler login`
- [ ] Account ID noted for later use

### Initial Deploy

- [ ] Run `pnpm cf:deploy`
- [ ] Note the `*.workers.dev` URL provided
- [ ] Visit the URL and verify site works
- [ ] Test critical user flows:
  - [ ] Homepage loads
  - [ ] Navigate to blog listing
  - [ ] Open a blog post
  - [ ] Check RSS feed
  - [ ] Test on mobile device

### Post-Deploy Verification

- [ ] All pages load correctly
- [ ] No 404 errors
- [ ] Images optimized and loading
- [ ] Performance acceptable (run Lighthouse)
- [ ] SSL certificate active
- [ ] Analytics tracking (Umami working)

## ⚙️ CI/CD Setup

### GitHub Secrets

- [ ] Get Cloudflare API Token (Edit Workers permission)
- [ ] Get Cloudflare Account ID from dashboard
- [ ] Add `CLOUDFLARE_API_TOKEN` to GitHub Secrets
- [ ] Add `CLOUDFLARE_ACCOUNT_ID` to GitHub Secrets

### Workflow Configuration

- [ ] `.github/workflows/deploy-cloudflare.yml` exists
- [ ] Workflow triggers on push to `main`
- [ ] Workflow has correct permissions
- [ ] Environment variables set in workflow

### Testing CI/CD

- [ ] Make a small change (e.g., update README)
- [ ] Commit and push to `main` branch
- [ ] Watch GitHub Actions run
- [ ] Verify deployment succeeds
- [ ] Check deployed site has changes
- [ ] Monitor for any errors

## 🎯 Advanced Features Setup

### R2 Incremental Cache (Optional)

- [ ] Create R2 bucket in Cloudflare Dashboard
  - Name: `portifolio-cache`
  - Location: Automatic
- [ ] Uncomment R2 config in `wrangler.toml`
- [ ] Uncomment R2 cache in `open-next.config.ts`
- [ ] Redeploy with `pnpm cf:deploy`
- [ ] Verify R2 bucket shows activity

### Custom Domain (Optional)

- [ ] Domain DNS managed by Cloudflare
- [ ] Add custom domain in Workers dashboard
- [ ] Wait for SSL provisioning (automatic)
- [ ] Update `SITE_URL` in `wrangler.toml`
- [ ] Redeploy with `pnpm cf:deploy`
- [ ] Verify domain works with HTTPS
- [ ] Test all routes on custom domain

### Image Optimization

- [ ] `[images]` binding in wrangler.toml (already done)
- [ ] Using Next.js `<Image>` components
- [ ] Images serving in WebP/AVIF format
- [ ] Responsive image sizes working

## 📊 Monitoring Setup

### Cloudflare Dashboard

- [ ] Bookmark Workers dashboard
- [ ] Check metrics are populating
- [ ] Review request patterns
- [ ] Monitor error rates
- [ ] Set up alert notifications (optional)

### Logs and Analytics

- [ ] Test `pnpm wrangler tail` for live logs
- [ ] Analytics showing traffic
- [ ] Umami analytics still tracking
- [ ] No unexpected errors in logs

## 🔒 Security Checklist

- [ ] `.dev.vars` not committed to git
- [ ] API tokens stored in GitHub Secrets only
- [ ] No sensitive data in `wrangler.toml`
- [ ] Environment variables properly configured
- [ ] HTTPS working on all domains
- [ ] CSP headers configured (if needed)

## 🎨 Railway Migration (Zero Downtime)

### Parallel Running Phase

- [ ] Railway deployment still running
- [ ] Cloudflare deployment working
- [ ] Both URLs accessible
- [ ] Can compare performance
- [ ] Monitor both for 24-48 hours

### DNS Cutover (When Ready)

- [ ] Custom domain configured on Cloudflare
- [ ] SSL certificate active
- [ ] Test custom domain thoroughly
- [ ] Update DNS to point to Cloudflare
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify traffic moving to Cloudflare
- [ ] Monitor for issues

### Railway Cleanup (Optional)

- [ ] Cloudflare running smoothly for 30+ days
- [ ] No rollback needed
- [ ] Scale down or delete Railway deployment
- [ ] Update any documentation

## 📝 Documentation

- [ ] `CLOUDFLARE.md` - Main deployment guide exists
- [ ] `docs/ADVANCED-CLOUDFLARE.md` - Advanced features documented
- [ ] `docs/CI-CD-SETUP.md` - CI/CD setup guide exists
- [ ] Team members aware of new deployment process
- [ ] Emergency rollback procedure documented

## ✅ Production Ready Criteria

Before considering production-ready:

- [ ] Successful deployments for 1+ week
- [ ] No critical errors in logs
- [ ] Performance metrics acceptable
- [ ] CI/CD working reliably
- [ ] Monitoring in place
- [ ] Team trained on deployment process
- [ ] Rollback procedure tested

## 🎉 Success Metrics

After successful deployment, you should see:

- ✅ **Fast global response times** (<50ms edge latency)
- ✅ **High cache hit rates** (70%+ for static assets)
- ✅ **99.9%+ uptime** (Cloudflare SLA)
- ✅ **Improved performance scores** (Lighthouse)
- ✅ **Automated deployments** (push to main = live)
- ✅ **Zero downtime deployments**
- ✅ **Cost savings** (vs traditional hosting)

## 🆘 Rollback Plan

If issues occur:

1. **Immediate:** Revert DNS to Railway (if domain switched)
2. **Git:** Revert problematic commit and redeploy
3. **Wrangler:** Use Cloudflare dashboard to rollback deployment
4. **Full rollback:**
   - Restore `output: 'standalone'` in `next.config.mjs`
   - Remove `initOpenNextCloudflareForDev()` call
   - Deploy to Railway

## 📞 Support Resources

- [ ] Cloudflare Discord saved
- [ ] GitHub Issues for this repo
- [ ] OpenNext documentation bookmarked
- [ ] Team contact list updated

---

## Quick Reference Commands

```bash
# Local testing
pnpm dev                     # Development server
pnpm cf:preview             # Workers runtime preview

# Deployment
pnpm wrangler login         # Authenticate
pnpm cf:deploy              # Deploy to Cloudflare

# Monitoring
pnpm wrangler tail          # Live logs
pnpm wrangler tail --status error  # Error logs only

# Management
pnpm cf:typegen             # Generate env types
pnpm wrangler deployments list     # View deployments
```

---

**Last Updated:** 2026-01-08  
**Next Review:** After first successful week in production
