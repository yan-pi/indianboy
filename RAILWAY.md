# Railway Deployment Configuration

This project uses Next.js 16 with Turbopack and requires specific configuration for Railway deployment.

## Quick Fix Options

Railway provides two build methods:

### Option 1: Nixpacks (Default - Recommended)

Uses `nixpacks.toml` configuration. Railway auto-detects and uses this.

### Option 2: Docker (If Nixpacks fails)

Uses `Dockerfile` for build. Switch in Railway project settings:

- Go to Project Settings → Deploy
- Change "Builder" from "Nixpacks" to "Dockerfile"

## Required Configuration

### 1. Node.js Version

- **Minimum**: Node.js 20.9.0
- **Recommended**: Node.js 20.18.0 (LTS)
- Configured in: `.nvmrc` and `package.json` engines field

### 2. Package Manager

- **Package Manager**: pnpm 10.16.1+
- Configured in: `package.json` packageManager field
- Railway will auto-detect pnpm from `pnpm-lock.yaml`

### 3. Build Configuration

- **Build Provider**: Nixpacks (auto-detected)
- **Config File**: `nixpacks.toml`

## Railway Environment Variables

Set these in your Railway project settings:

```bash
# Production
NODE_ENV=production

# Next.js 16 specific
NEXT_TELEMETRY_DISABLED=1

# Optional: If you need webpack instead of Turbopack
# NEXT_BUILD_COMMAND=next build --webpack
```

## Build Commands

Railway will automatically run:

1. `pnpm install --frozen-lockfile` (install dependencies)
2. `pnpm run build` (build Next.js app)
3. `pnpm start` (start production server)

## Nixpacks Configuration

The `nixpacks.toml` file configures:

- Node.js 20 runtime
- pnpm package manager
- Build and start commands

## Troubleshooting

### Build fails with "Node.js version" error

- Ensure `.nvmrc` has `20.18.0`
- Check Railway project settings for Node.js version

### Build fails with "pnpm not found"

- Railway should auto-detect pnpm from `pnpm-lock.yaml`
- Check `nixpacks.toml` has corepack commands

### Build succeeds but deployment fails

- Check Railway logs for runtime errors
- Ensure all environment variables are set
- Verify production build works locally: `pnpm build && pnpm start`

### Turbopack issues

- Next.js 16 uses Turbopack by default
- If issues occur, try webpack: add `--webpack` flag to build command
- Or set environment variable: `NEXT_BUILD_COMMAND=next build --webpack`

## Local Testing

Test Railway-compatible build locally:

```bash
# Clean install
rm -rf node_modules .next
pnpm install --frozen-lockfile

# Production build
pnpm build

# Production start
pnpm start
```

## Next.js 16 Changes Affecting Railway

1. **Turbopack Default**: Now the default bundler (2-5x faster builds)
2. **Separate Output Dirs**: Dev and build use different directories
3. **React 19.2**: Requires compatible dependencies
4. **Node.js 20.9+**: Minimum version enforced

## Deployment Checklist

- [x] `.nvmrc` specifies Node.js 20.18.0
- [x] `package.json` has engines and packageManager fields
- [x] `nixpacks.toml` configures build process
- [x] `pnpm-lock.yaml` is committed
- [x] Build succeeds locally with `pnpm build`
- [ ] Railway environment variables are set
- [ ] Railway project uses correct build settings

## Railway CLI Commands

If you need to debug using Railway CLI:

```bash
# Login (interactive)
railway login

# Link to project
railway link

# View logs
railway logs

# Check status
railway status

# Open in browser
railway open
```

## Support

For Railway-specific issues:

- Railway Docs: https://docs.railway.app
- Next.js 16 Docs: https://nextjs.org/docs
- Railway Discord: https://discord.gg/railway
