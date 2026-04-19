---
name: walkthrough
description: Interactive DAO creation walkthrough — opens the app in a browser and fills out the entire Create DAO wizard step-by-step using browser automation. Screenshots each step to produce a visual guide. Use for demos or to generate documentation.
disable-model-invocation: true
---

# DAO Creation Walkthrough

Walk through the complete DAO creation flow using browser automation, producing a screenshot-based visual guide.

## Arguments

Optionally pass custom values: `/walkthrough [dao-name] [token-symbol]`

Defaults: DAO name = "Acme DAO", token symbol = "ACME"

## Steps

### 1. Determine target URL

If the dev server is running on localhost:3000, use that. Otherwise use the live site at `https://dao.huntington-analytics.com`. Check by curling localhost first:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null
```

Use localhost if 200, otherwise use the live URL.

### 2. Setup

```bash
mkdir -p /Users/edward/Documents/easydao/walkthrough-screenshots
```

Open the target URL with `mcp__chrome-devtools__new_page`.

### 3. Navigate to Create page

1. `mcp__chrome-devtools__navigate_page` to `{base}/create`
2. `mcp__chrome-devtools__wait_for` text: "Create Your DAO"
3. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/01-create-start.png`

### 4. Step 1 — Name & Token

1. `mcp__chrome-devtools__take_snapshot` to find the input fields
2. Find the "DAO Name" input and fill it with the dao-name argument (default "Acme DAO")
3. Find the "Token Symbol" input and fill it with the token-symbol argument (default "ACME")
4. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/02-name-filled.png`
5. Find and click the "Next" button
6. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/03-step2.png`

### 5. Step 2 — Members

1. `mcp__chrome-devtools__take_snapshot` to find the member inputs
2. Fill the first member address with `0x1234567890123456789012345678901234567890`
3. The amount field should already have `100000` — verify it's there
4. Click "+ Add Member" button
5. Fill the second member address with `0xABCDEF0123456789ABCDEF0123456789ABCDEF01`
6. Fill the second amount with `50000`
7. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/04-members-filled.png`
8. Click "Next"

### 6. Step 3 — Governance

1. `mcp__chrome-devtools__wait_for` text: "Voting Delay"
2. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/05-governance-defaults.png`
3. Verify the default values are displayed:
   - Voting Delay: shows time label (e.g., "1 day" or similar)
   - Voting Duration: shows time label (e.g., "7 days")
   - Quorum: "4% of total supply"
   - Execution Delay: shows time label (e.g., "1 day")
4. Take snapshot and verify sliders are present
5. Click "Next"

### 7. Step 4 — Review & Deploy

1. `mcp__chrome-devtools__wait_for` text: "Review Your DAO"
2. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/06-review.png`
3. Take snapshot and verify all summary fields are correct:
   - DAO Name matches input
   - Token Symbol matches input
   - Members: 2
   - Total Supply: 150,000 ACME
4. Verify the "Connect your wallet to deploy" warning is shown (since no wallet connected)
5. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/07-review-detail.png`

### 8. Navigate back through steps

Demonstrate the back navigation:
1. Click "Back" button
2. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/08-back-to-governance.png`
3. Click "Back" again
4. Verify members are still filled in (state preserved)
5. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/09-back-to-members.png`

### 9. Explore other pages

Navigate to the Explore page and a sample DAO dashboard to show the full app:

1. Navigate to `{base}/explore`
2. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/10-explore.png`
3. Navigate to `{base}/dao/0x0000000000000000000000000000000000000001`
4. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/11-dao-dashboard.png`
5. Navigate to `{base}/dao/0x0000000000000000000000000000000000000001/treasury`
6. `mcp__chrome-devtools__take_screenshot` -> `walkthrough-screenshots/12-treasury.png`

### 10. Generate summary

Output a visual guide summary:

```
## EasyDAO Walkthrough — [date]

### Screenshots saved to: /Users/edward/Documents/easydao/walkthrough-screenshots/

### Flow:
1. 01-create-start.png — Landing on the create page
2. 02-name-filled.png — DAO name and token symbol entered
3. 03-step2.png — Members step
4. 04-members-filled.png — Two members added with token allocations
5. 05-governance-defaults.png — Governance parameters with sensible defaults
6. 06-review.png — Final review before deployment
7. 07-review-detail.png — Deploy button (wallet connection required)
8. 08-back-to-governance.png — Back navigation preserves state
9. 09-back-to-members.png — Member data preserved on back nav
10. 10-explore.png — Explore page (empty state)
11. 11-dao-dashboard.png — DAO dashboard view
12. 12-treasury.png — Treasury management view

### Configuration Used:
- DAO Name: [name]
- Token Symbol: [symbol]
- Members: 2 (0x1234...7890, 0xABCD...EF01)
- Total Supply: 150,000 [symbol]
- Governance: defaults (1 day delay, 7 day voting, 4% quorum)
```

### 11. Cleanup

Close the browser tab.
