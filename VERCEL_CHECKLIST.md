# Vercel Deployment Checklist for Retro Chat Bot

## Pre-Deployment Audit ✅

### TypeScript & Build
- [x] **App Entry Point** (`artifacts/api-server/src/index.ts`)
  - Properly exports Express app
  - Listens on PORT environment variable
  - Error handling configured

- [x] **Express Setup** (`artifacts/api-server/src/app.ts`)
  - pino-http middleware correctly imported (ESM compatible)
  - CORS configured
  - Express middleware chain proper
  - All route handlers have type annotations

- [x] **Route Handlers**
  - `src/routes/health.ts` - Health check endpoint at `/healthz`
  - `src/routes/openai/conversations.ts` - Chat endpoints
  - All handlers have `Request` and `Response` types
  - All parameters properly typed

- [x] **Dependencies**
  - `@workspace/api-zod` - Exports TypeScript source files
  - `@workspace/db` - Database layer referenced
  - `@workspace/integrations-openai-ai-server` - OpenAI client
  - All external packages bundled with esbuild

### Build Configuration
- [x] **esbuild Config** (`artifacts/api-server/build.mjs`)
  - ESM format output
  - Correct external packages listed
  - Pino plugin configured
  - Banner includes CommonJS compatibility

- [x] **TypeScript Config** (`artifacts/api-server/tsconfig.json`)
  - Extends base config
  - Project references correct
  - Output directory: `dist`

- [x] **Workspace Config** (`pnpm-workspace.yaml`)
  - All packages listed correctly
  - Monorepo structure defined
  - Catalog versions specified

### Vercel Configuration
- [x] **vercel.json**
  - Build command: `pnpm install && pnpm run typecheck && pnpm run build`
  - Install command: `pnpm install --frozen-lockfile`
  - Output directory: `artifacts/api-server/dist`
  - Runtime: `nodejs20.x`
  - Function timeout: 60 seconds
  - Memory: 1024 MB
  - Routes configured for all HTTP methods

### Environment Variables Required
- [ ] `PORT` - Set to `3000`
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `NODE_ENV` - Set to `production`
- [ ] `LOG_LEVEL` - Set to `info`
- [ ] `DATABASE_URL` - Database connection (if applicable)

### Runtime Requirements
- [x] Node.js version: 20.x (specified in vercel.json)
- [x] Package manager: pnpm (detected from workspace)
- [x] Memory: 1024 MB (sufficient for bundling)
- [x] Timeout: 60 seconds (for API requests)

## Deployment Steps

### Step 1: Connect GitHub to Vercel
```
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select "Hassanjaff/Retro-Chat-Bot"
4. Authorize GitHub access if prompted
```

### Step 2: Configure Environment Variables
```
In Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add each variable:
   - PORT=3000
   - OPENAI_API_KEY=<your_key>
   - NODE_ENV=production
   - LOG_LEVEL=info
3. Set scope to "Production"
```

### Step 3: Deploy
```
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Check deployment logs for errors
4. Once complete, note the deployment URL
```

### Step 4: Test Health Endpoint
```bash
curl https://<your-deployment>.vercel.app/api/healthz
# Expected response:
# {"status":"ok"}
```

## Deployment Validation

### After Deployment, Verify:

- [ ] **Health Check Passes**
  ```bash
  curl https://<deployment-url>/api/healthz
  # Should return: {"status":"ok"}
  ```

- [ ] **Build Logs Show Success**
  - No TypeScript errors
  - esbuild completed successfully
  - All dependencies resolved

- [ ] **Environment Variables Set**
  - OPENAI_API_KEY configured
  - PORT accessible
  - NODE_ENV=production

- [ ] **Server Listens on PORT**
  - Check Vercel logs for "Server listening"
  - No "PORT not found" errors

- [ ] **No Module Resolution Errors**
  - @workspace/api-zod resolves
  - @workspace/db resolves
  - All imports work correctly

## Common Issues & Solutions

### Build Error: "Emit skipped"
**Cause**: TypeScript compilation error in route handlers
**Solution**: 
- Ensure all route handler parameters have type annotations
- Check that imports are correct
- Verify workspace dependencies are built

### 502 Bad Gateway
**Cause**: Server not running or PORT not configured
**Solution**:
- Check PORT environment variable is set to 3000
- Review Vercel logs for startup errors
- Verify OPENAI_API_KEY is configured

### Module Not Found "@workspace/api-zod"
**Cause**: TypeScript source files not resolving
**Solution**:
- Verify api-zod package.json exports point to src/index.ts
- Ensure all workspace packages are listed in pnpm-workspace.yaml
- Check that esbuild bundles source TypeScript correctly

### Cannot find module "pino"
**Cause**: External dependency not installed
**Solution**:
- Verify pino is in artifacts/api-server/package.json dependencies
- Check esbuild configuration doesn't externalize pino
- Use esbuild-plugin-pino for proper bundling

## Monitoring Post-Deployment

1. **Check Vercel Dashboard**
   - Deployments tab: See build history
   - Function logs: Monitor request/response logs
   - Metrics: Track performance

2. **Monitor API Health**
   ```bash
   # Regular health check
   watch -n 60 'curl https://<deployment-url>/api/healthz'
   ```

3. **Review Logs**
   - Vercel dashboard shows real-time logs
   - Filter by status code, function, or time range
   - Set up alerts for failures

## Success Criteria

✅ Project is successfully deployed when:
1. Build completes without errors
2. Health endpoint returns `{"status":"ok"}`
3. All environment variables are set
4. No 502/503 errors in logs
5. API responds to requests within timeout

## Next Steps After Deployment

1. Share deployment URL with frontend team
2. Configure CORS for your frontend domain
3. Test OpenAI chat endpoints with sample requests
4. Set up monitoring/alerting in Vercel
5. Document API endpoints for consumers

---

**Last Updated**: 2026-06-04  
**Deployment Target**: Vercel  
**Node.js Version**: 20.x  
**Package Manager**: pnpm  
