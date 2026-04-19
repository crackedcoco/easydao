---
name: deploy-verify
description: Build the EasyDAO app, deploy to S3, invalidate CloudFront, then open the live site in the browser and screenshot every page to confirm the deploy succeeded. Use after code changes are ready to ship.
disable-model-invocation: true
---

# Deploy & Verify Workflow

Build, deploy, and visually verify the live EasyDAO site.

## Infrastructure Reference

- **S3 bucket**: `dao.huntington-analytics.com` (us-east-1)
- **CloudFront**: `EUDCJ7GQ4FLUT`
- **Live URL**: `https://dao.huntington-analytics.com`

## Steps

### 1. Run tests

```bash
cd /Users/edward/Documents/easydao/contracts && source ~/.zshenv && forge test
```

All 28 contract tests must pass before deploying. Abort if any fail.

### 2. Build the frontend

```bash
cd /Users/edward/Documents/easydao/app && npx next build
```

Must see "Generating static pages" success. The output goes to the `out/` directory. Abort if build fails.

### 3. Deploy to S3

```bash
aws s3 sync /Users/edward/Documents/easydao/app/out/ s3://dao.huntington-analytics.com/ --region us-east-1 --delete
```

The `--delete` flag removes old files that no longer exist in the build.

### 4. Invalidate CloudFront cache

```bash
aws cloudfront create-invalidation --distribution-id EUDCJ7GQ4FLUT --paths "/*"
```

Note the invalidation ID for reference.

### 5. Wait for propagation

Wait ~15 seconds for CloudFront edge caches to begin clearing, then proceed to verification.

### 6. Open browser and verify

Use `mcp__chrome-devtools__new_page` to open `https://dao.huntington-analytics.com`.

**Verify each page:**

| Page | URL | Expected |
|------|-----|----------|
| Landing | `/` | "Create a DAO in minutes" hero text |
| Create | `/create` | "Create Your DAO" heading, step indicator |
| Explore | `/explore` | "Explore DAOs" heading |
| DAO view | `/dao/0x0000000000000000000000000000000000000001` | Tab navigation renders |

For each:
1. `mcp__chrome-devtools__navigate_page` to the URL
2. `mcp__chrome-devtools__wait_for` with expected text (timeout 10000ms)
3. `mcp__chrome-devtools__take_screenshot` saved to `/Users/edward/Documents/easydao/deploy-screenshots/{page-name}.png`

### 7. Verify SPA routing

Navigate directly to a deep route like `/dao/0x.../proposals/new` by entering the URL. This tests that the CloudFront 404->index.html fallback is working for client-side routing.

### 8. Report

```
## Deploy Report — [date]

### Build: pass/fail
### S3 Sync: X files uploaded
### CloudFront Invalidation: [id]
### Live Verification:
- Landing page: pass/fail
- Create page: pass/fail
- Explore page: pass/fail
- DAO pages: pass/fail
- SPA routing: pass/fail

### Screenshots: /Users/edward/Documents/easydao/deploy-screenshots/
### Live URL: https://dao.huntington-analytics.com
```

### 9. Cleanup

Close the browser tab.
