---
name: qa
description: Visual QA — starts dev server, opens browser, navigates every EasyDAO page, screenshots each, and reports layout/rendering issues. Use when you want to visually verify the app after code changes.
disable-model-invocation: true
---

# Visual QA Workflow

Run a full visual QA pass on the EasyDAO app using browser automation.

## Steps

### 1. Start the dev server

```bash
cd /Users/edward/Documents/easydao/app && npm run dev
```

Run this in the background. Wait for the "Ready" message before proceeding.

### 2. Open the browser

Use `mcp__chrome-devtools__new_page` to open `http://localhost:3000`.

### 3. Navigate and screenshot every page

For each page below, navigate to the URL, wait for content to load, take an accessibility snapshot, take a screenshot, and note any issues.

**Pages to test:**

| Page | URL | What to verify |
|------|-----|----------------|
| Landing | `http://localhost:3000` | Hero renders, feature cards visible, CTA buttons present |
| Create Wizard Step 1 | `http://localhost:3000/create` | Form fields render, step indicator shows step 1 |
| Explore | `http://localhost:3000/explore` | Empty state shows with "No DAOs created yet" |
| DAO Overview | `http://localhost:3000/dao/0x0000000000000000000000000000000000000001` | Tab nav renders, stats cards show "..." loading state |
| DAO Proposals | `http://localhost:3000/dao/0x0000000000000000000000000000000000000001/proposals` | Empty state with "No proposals yet" |
| DAO Treasury | `http://localhost:3000/dao/0x0000000000000000000000000000000000000001/treasury` | Balance cards render, assets section visible |
| DAO Members | `http://localhost:3000/dao/0x0000000000000000000000000000000000000001/members` | Delegation card renders, delegate input visible |
| New Proposal | `http://localhost:3000/dao/0x0000000000000000000000000000000000000001/proposals/new` | Form renders with title, description, target fields |
| Invalid Proposal | `http://localhost:3000/dao/0x0000000000000000000000000000000000000001/proposals/abc` | Should show "Invalid Proposal ID" error |

For each page:
1. `mcp__chrome-devtools__navigate_page` with the URL
2. `mcp__chrome-devtools__wait_for` with key text (e.g., "Create a DAO", "Explore DAOs")
3. `mcp__chrome-devtools__take_screenshot` saved to `/Users/edward/Documents/easydao/qa-screenshots/{page-name}.png`
4. `mcp__chrome-devtools__take_snapshot` to check the accessibility tree for missing labels or broken elements

### 4. Test the Create Wizard flow

Navigate to `/create` and verify all 4 steps work:
1. Fill in DAO name and token symbol, click Next
2. Verify member inputs render, click Next
3. Verify governance sliders render with correct defaults and labels
4. Click Next to reach Review step, verify summary renders

Take a screenshot at each step.

### 5. Test responsive layout

Use `mcp__chrome-devtools__resize_page` to test at mobile (375x812) and tablet (768x1024) widths. Screenshot the landing page and create page at each size.

### 6. Report

After all pages are tested, provide a summary:

```
## QA Report — [date]

### Pages Tested: X/9
### Screenshots: /Users/edward/Documents/easydao/qa-screenshots/

### Issues Found:
- [severity] [page] — description

### Responsive:
- Mobile: pass/fail
- Tablet: pass/fail
- Desktop: pass/fail
```

### 7. Cleanup

Stop the dev server background process. Close the browser tab.
