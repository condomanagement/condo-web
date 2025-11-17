# GitHub Actions CI/CD Pipeline

## Overview
The project uses GitHub Actions for automated testing, linting, building, and deployment. Each workflow runs independently for faster feedback and better visibility.

## Workflows

### 1. Lint (`lint.js.yml`)
**Triggers:** Push to main, Pull Requests  
**Purpose:** Code quality checks with ESLint  
**Runs:** `npm run lint:ci` (fails on any warnings)  
**Duration:** ~30 seconds

**Status:** [![Lint](https://github.com/condomanagement/condo-web/actions/workflows/lint.js.yml/badge.svg)](https://github.com/condomanagement/condo-web/actions/workflows/lint.js.yml)

### 2. Test (`test.yml`)
**Triggers:** Push to main, Pull Requests  
**Purpose:** Run unit and integration tests  
**Runs:** `npm test -- --coverage`  
**Duration:** ~1 minute  
**Artifacts:** Coverage reports uploaded to Codecov

**Status:** [![Test](https://github.com/condomanagement/condo-web/actions/workflows/test.yml/badge.svg)](https://github.com/condomanagement/condo-web/actions/workflows/test.yml)

### 3. Build (`node.js.yml`)
**Triggers:** Push to main, Pull Requests  
**Purpose:** Build client and server applications  
**Runs:**
- `npm run build` (client)
- `npm run build-server` (server)

**Duration:** ~2 minutes  
**Artifacts:** Build output stored for 7 days

**Status:** [![Build](https://github.com/condomanagement/condo-web/actions/workflows/node.js.yml/badge.svg)](https://github.com/condomanagement/condo-web/actions/workflows/node.js.yml)

### 4. Deploy (`main.yml`)
**Triggers:** Push to main, Manual workflow dispatch  
**Purpose:** Deploy to Azure Web App  
**Steps:**
1. Build application
2. Create deployment package
3. Deploy to Azure (Production slot)

**Duration:** ~5 minutes

### 5. CodeQL (`codeql.yml`)
**Triggers:** Push to main, Pull Requests, Weekly schedule  
**Purpose:** Security scanning and vulnerability detection  
**Language:** JavaScript/TypeScript  
**Duration:** ~3 minutes

## Workflow Matrix

| Workflow | Lint | Test | Build | Deploy | CodeQL |
|----------|------|------|-------|--------|--------|
| PR to main | ✅ | ✅ | ✅ | ❌ | ✅ |
| Push to main | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manual | ❌ | ❌ | ❌ | ✅ | ❌ |
| Schedule | ❌ | ❌ | ❌ | ❌ | ✅ (weekly) |

## Node.js Version
All workflows use Node.js **24.x** (latest LTS)

## Caching
All workflows use npm caching via `actions/setup-node@v4` to speed up dependency installation.

## Parallel Execution
All PR checks (Lint, Test, Build, CodeQL) run in parallel for faster feedback:
- ✅ Typical PR check time: **~3 minutes** (limited by slowest job)
- ✅ Individual feedback on each check
- ✅ Can merge if any single check is fixed

## Required Checks (Recommended Branch Protection)
For main branch, consider requiring these checks to pass:
- ✅ Lint
- ✅ Test  
- ✅ Build
- ✅ CodeQL

## Artifacts & Outputs

### Build Artifacts
- **Location:** `build/` and `server-dist/`
- **Retention:** 7 days
- **Use:** Can be downloaded for debugging or manual deployment

### Test Coverage
- **Format:** lcov.info
- **Upload:** Codecov (if configured)
- **Visibility:** PR comments with coverage diff

## Secrets Required

### Azure Deployment
- `AZUREAPPSERVICE_PUBLISHPROFILE_B562CD3665B240149918D657B05A9639`
  - Azure Web App publish profile
  - Used by: `main.yml` (Deploy workflow)

### Optional: Codecov
- `CODECOV_TOKEN` (if using private repo)
  - Coverage upload token
  - Used by: `test.yml`

## Local Development

### Run same checks locally:
```bash
# Lint (same as CI)
npm run lint:ci

# Test (same as CI)
npm test -- --coverage

# Build (same as CI)
npm run build
npm run build-server

# All together
npm run lint:ci && npm test && npm run build && npm run build-server
```

## Troubleshooting

### "npm ci" fails
- Ensure `package-lock.json` is committed and up to date
- Run `npm install` locally and commit the updated lock file

### Lint fails in CI but passes locally
- CI uses `npm run lint:ci` which has `--max-warnings 0`
- Fix warnings or run `npm run lint:ci` locally to see them

### Tests fail in CI but pass locally
- Check Node.js version matches (24.x)
- Ensure all dependencies are in package.json (not global)
- Check for timing-dependent tests

### Build fails in CI but works locally
- Check if `.env` or local config is needed
- Verify all source files are committed
- Check TypeScript compilation with `npx tsc --noEmit`

## Monitoring

View workflow status:
- **GitHub UI:** https://github.com/condomanagement/condo-web/actions
- **Badge Status:** README badges show current main branch status
- **PR Checks:** Each PR shows status of all checks

## Future Improvements
- [ ] Add E2E tests workflow
- [ ] Add performance testing
- [ ] Add lighthouse CI for performance metrics
- [ ] Configure Codecov badge and PR comments
- [ ] Add deployment preview for PRs (staging environment)
- [ ] Add automated dependency updates (Dependabot/Renovate)
