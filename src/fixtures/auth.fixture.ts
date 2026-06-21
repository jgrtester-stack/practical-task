import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { USERS } from '../utils/test-data';

/**
 * Logs in via the real login form and waits until /inventory.html is reached.
 * More reliable than localStorage injection — SauceDemo does not expose a
 * stable localStorage key that the app reads on load.
 */
async function injectAuth(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
  await page.waitForURL('**/inventory.html');
}

type Fixtures = {
  /** Auth-injected page already on /inventory.html. */
  loggedIn: Page;
  /** Raw unauthenticated page — for auth.spec.ts only. */
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<Fixtures>({
  /**
   * Injects auth then yields the same Page that Playwright's base `page`
   * fixture uses — so `{ page }` in a test that also uses `{ inventoryPage }`
   * receives the already-authenticated page.
   */
  loggedIn: async ({ page }: { page: Page }, use: (p: Page) => Promise<void>) => {
    await injectAuth(page);
    await use(page);
  },

  // ── Unauthenticated ─────────────────────────────────────────────────────────
  // loginPage intentionally does NOT depend on loggedIn — auth.spec.ts tests
  // the login form itself, so no session must be pre-injected.
  loginPage: async ({ page }: { page: Page }, use: (f: LoginPage) => Promise<void>) => {
    await use(new LoginPage(page));
  },

  // ── Authenticated page objects ───────────────────────────────────────────────
  // Each depends on `loggedIn`, so auth is always injected before the page object
  // is constructed, regardless of the order fixtures are listed in the test.
  inventoryPage:        async ({ loggedIn }: { loggedIn: Page }, use: (f: InventoryPage)        => Promise<void>) => { await use(new InventoryPage(loggedIn)); },
  cartPage:             async ({ loggedIn }: { loggedIn: Page }, use: (f: CartPage)             => Promise<void>) => { await use(new CartPage(loggedIn)); },
  checkoutInfoPage:     async ({ loggedIn }: { loggedIn: Page }, use: (f: CheckoutInfoPage)     => Promise<void>) => { await use(new CheckoutInfoPage(loggedIn)); },
  checkoutOverviewPage: async ({ loggedIn }: { loggedIn: Page }, use: (f: CheckoutOverviewPage) => Promise<void>) => { await use(new CheckoutOverviewPage(loggedIn)); },
  checkoutCompletePage: async ({ loggedIn }: { loggedIn: Page }, use: (f: CheckoutCompletePage) => Promise<void>) => { await use(new CheckoutCompletePage(loggedIn)); },
});

export { expect } from '@playwright/test';
