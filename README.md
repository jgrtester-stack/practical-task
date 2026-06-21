# Playwright Test + TypeScript — SauceDemo Automation Framework

End-to-end test automation framework for [https://www.saucedemo.com](https://www.saucedemo.com) built with Playwright Test, TypeScript, and Allure reporting.

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18 LTS or later |
| npm | 9 or later (bundled with Node.js) |

---

## Installation

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Configure environment

Create a `.env` file in the project root:

```env
BASE_URL=https://www.saucedemo.com
USER_NAME=standard_user
USER_PASSWORD=secret_sauce
```

> The `.env` file is in `.gitignore` and must be created locally. If the file is absent the framework falls back to the values shown above.

---

## Running Tests

All commands are run from the project root.

### Run all tests (Chromium, no Allure)

```bash
npm test
```

### Run all tests on all browsers (Chromium, Firefox, WebKit)

`test:all` has no `--project` filter, so Playwright runs every test against all three configured browsers (Chromium, Firefox, WebKit) in parallel. Use this for full cross-browser coverage.

> Locally capped at **4 parallel workers** to prevent system resource exhaustion from too many concurrent browser processes. On CI the runner is sequential (1 worker).

```bash
npm run test:all
```

### Run on a specific browser

```bash
npm run test:firefox
npm run test:webkit
```

> To run on Chromium only, use `npm test`.

### Run in headed mode (browser window visible)

```bash
npm run test:headed
```

### Run with Playwright UI (interactive test explorer)

```bash
npm run test:ui
```

### Run in debug mode (step-by-step with Playwright Inspector)

```bash
npm run test:debug
```

---

## Smoke Tests

Smoke tests cover the critical happy-path scenarios and one intentional failure used as a learning example.

### Smoke test inventory

| ID | File | Description | Tags | Expected result |
|---|---|---|---|---|
| S0 | `auth.spec.ts` | Successful login with valid credentials redirects to inventory page | `@smoke @regression @auth` | Pass |
| S4 | `inventory.spec.ts` | Add a product to the cart — button changes to Remove, badge shows 1 | `@smoke @regression @inventory` | Pass |
| S11 | `cart.spec.ts` | Cart lists 2 added products with correct name, description, price and quantity | `@smoke @regression @cart` | Pass |
| S13 | `checkout.spec.ts` | Complete checkout happy path — confirmation shown, cart emptied | `@smoke @regression @checkout` | Pass |

### Run smoke tests only (no Allure report)

```bash
npm run test:smoke
```

### Run smoke tests and open Allure report automatically

```bash
npm run smoke:report
```

> Every test run writes results to `allure-results/`. `smoke:report` runs the tests, generates the report from those results, and opens it in your browser in one step.

---

## Regression Tests

Regression tests cover all scenarios across all sections of the application.

### Regression test inventory

| ID | File | Description | Tags | Expected result |
|---|---|---|---|---|
| S0 | `auth.spec.ts` | Successful login with valid credentials redirects to inventory page | `@smoke @regression @auth` | Pass |
| S1 | `auth.spec.ts` | Login with empty credentials — error shown, error CSS on both inputs | `@regression @auth @negative` | Pass |
| S2 | `auth.spec.ts` | Invalid user `error_user` — credential mismatch expected, but logs in successfully | `@regression @auth @negative` | **Intentionally fails** |
| S3 | `auth.spec.ts` | Login with locked-out user — specific lock-out error, no redirect | `@regression @auth @negative` | Pass |
| S4 | `inventory.spec.ts` | Add a product — button changes to Remove, badge = 1 | `@smoke @regression @inventory` | Pass |
| S6 | `inventory.spec.ts` | Add 3 products — badge = 3, all 3 buttons in Remove state | `@regression @inventory` | Pass |
| S7 | `inventory.spec.ts` | Remove one of two products — button reverts, badge decrements to 1 | `@regression @inventory` | Pass |
| S7 edge | `inventory.spec.ts` | Remove the only cart item — badge disappears entirely | `@regression @inventory` | Pass |
| S8 | `inventory.spec.ts` | Navigate to product detail page — correct name, description, price | `@regression @inventory` | Pass |
| S11 | `cart.spec.ts` | Cart lists 2 products with correct name, description, price and quantity | `@smoke @regression @cart` | Pass |
| S12 | `cart.spec.ts` | Continue Shopping returns to inventory with cart items intact | `@regression @cart` | Pass |
| S13 | `checkout.spec.ts` | Complete checkout happy path — confirmation shown, cart emptied | `@smoke @regression @checkout` | Pass |
| S14a | `checkout.spec.ts` | Checkout validation — first name missing: error shown, stays on step 1 | `@regression @checkout @negative` | Pass |
| S14b | `checkout.spec.ts` | Checkout validation — last name missing: error shown, stays on step 1 | `@regression @checkout @negative` | Pass |
| S14c | `checkout.spec.ts` | Checkout validation — postal code missing: error shown, stays on step 1 | `@regression @checkout @negative` | Pass |
| S17 | `checkout.spec.ts` | Cancel checkout — returns to cart with all items still present | `@regression @checkout` | Pass |
| S18 | `e2e.spec.ts` | Full purchase journey: login → add/remove → checkout → confirm → empty cart | `@regression @e2e` | Pass |

**Total: 17 tests — 16 pass, 1 intentionally fails (S3)**

### Run regression tests (no Allure report)

```bash
npm run test:regression
```

### Run regression tests and open Allure report automatically

```bash
npm run regression:report
```

---

## Allure Reports

Allure results are written automatically on every test run. You only need to generate and open the report afterwards.

### Generate report only

```bash
npm run report:generate
```

### Open last generated report

```bash
npm run report:open
```

### Generate and open in one step

```bash
npm run report
```

> The report is saved to `allure-report/`. It is regenerated fresh on each `report:generate` call (`--clean` flag).

---

## Project Structure

```
playwright-test-ts/
├── src/
│   ├── fixtures/          # Custom Playwright fixtures (auth injection)
│   ├── helpers/           # Shared test helpers (cart setup)
│   ├── pages/             # Page Object Model classes
│   ├── tests/             # Test specifications (.spec.ts)
│   └── utils/             # Test data constants
├── allure-results/        # Raw Allure output (git-ignored)
├── allure-report/         # Generated HTML report (git-ignored)
├── playwright.config.ts   # Playwright configuration
├── .env                   # Local environment variables (git-ignored)
└── package.json
```

---

## npm Scripts Reference

| Script | Description |
|---|---|
| `npm test` | All tests on Chromium only |
| `npm run test:all` | All tests on **all three browsers** (Chromium + Firefox + WebKit) — no `--project` filter |
| `npm run test:firefox` | All tests on Firefox |
| `npm run test:webkit` | All tests on WebKit |
| `npm run test:smoke` | Smoke tests on Chromium (no report) |
| `npm run test:regression` | Regression tests on Chromium (no report) |
| `npm run test:headed` | All tests on Chromium with browser window visible |
| `npm run test:ui` | Interactive Playwright UI mode |
| `npm run test:debug` | Step-by-step debug with Playwright Inspector |
| `npm run smoke:report` | Smoke tests → generate Allure report → open |
| `npm run regression:report` | Regression tests → generate Allure report → open |
| `npm run report:generate` | Generate Allure report from last results |
| `npm run report:open` | Open last generated Allure report |
| `npm run report` | Generate + open Allure report |
