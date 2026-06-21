/**
 * Section A – Authentication
 * Tags: @auth @negative
 * Scenario 2 fails on purpose, error_user that supposed to mimmick failed login - logs in successfully.
 */
import { test, expect } from '../fixtures/auth.fixture';
import { USERS, ERROR_MESSAGES } from '../utils/test-data';

test.describe('Section A – Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'Scenario 0 Successful login with valid credentials redirects to inventory page',
    { tag: ['@smoke', '@regression', '@auth'] },
    async ({ loginPage, page }) => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);

      await expect(page).toHaveURL(/inventory\.html/);
    }
  );

  test(
    'Scenario 1 Login with empty credentials - error shown, error CSS on both inputs, user stays on login',
    { tag: ['@regression', '@auth', '@negative'] },
    async ({ loginPage, page }) => {
      await loginPage.login('', '');

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.usernameRequired);
      await expect(page).toHaveURL('/');
      await expect(loginPage.usernameInput).toHaveClass(/error/);
      await expect(loginPage.passwordInput).toHaveClass(/error/);
    }
  );

  test(
    'Scenario 2 Invalid user called error_user taken from saucedemo: credential should trigger mismatch error, user stays on login',
    { tag: ['@regression', '@auth', '@negative'] },
    async ({ loginPage, page }) => {
      await loginPage.login(USERS.error.username, USERS.error.password);

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.credentialsMismatch);
      await expect(page).toHaveURL('/');
    }
  );

  test(
    'Scenario 3 Login with locked-out user: specific lock-out error, no redirect',
    { tag: ['@regression', '@auth', '@negative'] },
    async ({ loginPage, page }) => {
      await loginPage.login(USERS.locked.username, USERS.locked.password);

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.lockedOut);
      await expect(page).toHaveURL('/');
    }
  );
});
