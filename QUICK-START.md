# 🚀 Quick Start - Cloudflare Deployment

**Your project is ready to deploy to Cloudflare Workers!**

## ⚡ Deploy Now (3 Steps)

### 1. Authenticate with Cloudflare

```bash
pnpm wrangler login
```

This opens your browser to login to Cloudflare.

### 2. Deploy to Cloudflare

```bash
pnpm cf:deploy
```

This builds and deploys your app. You'll get a URL like:

```
https://portifolio.YOUR-SUBDOMAIN.workers.dev
```

### 3. Test Your Deployment

Visit the URL and verify:

- ✅ Homepage loads
- ✅ Blog posts work
- ✅ Theme switching works
- ✅ Images load

**That's it! Your site is live on Cloudflare's global edge network! 🎉**

---

## 🔄 Enable CI/CD (Auto-Deploy on Git Push)

### 1. Get Cloudflare Credentials

**API Token:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Profile → API Tokens → Create Token
3. Use "Edit Cloudflare Workers" template
4. Copy the token

**Account ID:**

1. In Cloudflare Dashboard → Workers & Pages
2. Copy Account ID from sidebar (or URL)

### 2. Add to GitHub Secrets

1. Go to your repo: Settings → Secrets and variables → Actions
2. Add `CLOUDFLARE_API_TOKEN` with your token
3. Add `CLOUDFLARE_ACCOUNT_ID` with your account ID

### 3. Push to Main

```bash
git add .
git commit -m "Enable Cloudflare CI/CD"
git push origin main
```

**Now every push to `main` automatically deploys!** 🚀

---

## 🎯 Enable Advanced Features

### R2 Cache (ISR Support)

**Why?** Enables Next.js Incremental Static Regeneration

1. Create R2 bucket in [Cloudflare Dashboard](https://dash.cloudflare.com) → R2
   - Name: `portifolio-cache`
2. Edit `wrangler.toml` - uncomment R2 section
3. Edit `open-next.config.ts` - uncomment R2 cache import
4. Redeploy: `pnpm cf:deploy`

**Guide:** See `docs/ADVANCED-CLOUDFLARE.md`

### Custom Domain

**Why?** Use `indianboy.sh` instead of `*.workers.dev`

1. In Cloudflare Dashboard → Workers → portifolio → Settings → Domains
2. Add custom domain: `indianboy.sh`
3. Cloudflare auto-configures DNS + SSL
4. Update `SITE_URL` in `wrangler.toml`
5. Redeploy: `pnpm cf:deploy`

**Guide:** See `docs/ADVANCED-CLOUDFLARE.md`

---

## 📚 Documentation

| File                          | Description             |
| ----------------------------- | ----------------------- |
| `CLOUDFLARE.md`               | Main deployment guide   |
| `DEPLOYMENT-CHECKLIST.md`     | Step-by-step checklist  |
| `docs/CI-CD-SETUP.md`         | CI/CD setup guide       |
| `docs/ADVANCED-CLOUDFLARE.md` | R2, domains, monitoring |

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Test locally first
pnpm cf:build

# Check for errors
pnpm build
```

### Deploy Fails

```bash
# Re-authenticate
pnpm wrangler login

# Try again
pnpm cf:deploy
```

### Site Not Loading

- Wait 1-2 minutes for deployment
- Clear browser cache (Cmd+Shift+R)
- Check Cloudflare Dashboard for errors

---

## 🎉 What's Next?

**After your first deployment:**

1. ✅ Test the deployed site thoroughly
2. ✅ Set up CI/CD (auto-deploy)
3. ✅ Configure custom domain (optional)
4. ✅ Enable R2 cache for ISR (optional)
5. ✅ Monitor in Cloudflare Dashboard

**Your site now has:**

- 🌍 Global edge deployment (sub-50ms worldwide)
- 🚀 Auto-scaling (handles any traffic)
- 🔒 Free SSL certificates
- 💰 Generous free tier (100K requests/day)
- ⚡ Zero-downtime deployments
- 🛡️ DDoS protection

---

## 📞 Need Help?

- Check `DEPLOYMENT-CHECKLIST.md` for detailed steps
- See `CLOUDFLARE.md` for full documentation
- Cloudflare Discord: [discord.gg/cloudflare](https://discord.gg/cloudflare)

---

**Ready to deploy?** Run `pnpm cf:deploy` and let's go! 🚀
