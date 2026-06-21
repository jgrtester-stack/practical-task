/**
 * Section D – Checkout Flow
 * Tags: @checkout @smoke @negative
 */
import { test, expect } from '../fixtures/auth.fixture';
import { addProductsToCart } from '../helpers/cart.helper';
import { PRODUCTS, CHECKOUT_INFO, ERROR_MESSAGES } from '../utils/test-data';

test.describe('Section D – Checkout Flow', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await addProductsToCart(inventoryPage, [PRODUCTS.backpack, PRODUCTS.bikeLight]);
    await cartPage.goto();
    await cartPage.checkout(); // lands on /checkout-step-one.html
  });

  test(
    'Scenario 13 Complete checkout happy path - shows confirmation and empties the cart',
    { tag: ['@smoke', '@regression', '@checkout'] },
    async ({ checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage, cartPage, page }) => {
      await checkoutInfoPage.fillInfo(
        CHECKOUT_INFO.firstName,
        CHECKOUT_INFO.lastName,
        CHECKOUT_INFO.postalCode,
      );
      await checkoutInfoPage.continue();

      // Overview assertions
      const overviewItems = await checkoutOverviewPage.getItemNames();
      expect(overviewItems).toContain(PRODUCTS.backpack);
      expect(overviewItems).toContain(PRODUCTS.bikeLight);
      await expect(checkoutOverviewPage.subtotalLabel).toContainText('Item total: $39.98');
      await expect(checkoutOverviewPage.totalLabel).toContainText('Total: $43.18');

      await checkoutOverviewPage.finish();

      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutCompletePage.completeMessage).toHaveText('Thank you for your order!');

      // Cart must be empty after purchase
      await cartPage.goto();
      expect(await cartPage.getItemCount()).toBe(0);
    }
  );

  // Scenario 14 Checkout validation – missing required fields
  const validationCases = [
    {
      label:         'first name missing',
      firstName:     '',
      lastName:      CHECKOUT_INFO.lastName,
      postalCode:    CHECKOUT_INFO.postalCode,
      expectedError: ERROR_MESSAGES.firstNameRequired,
    },
    {
      label:         'last name missing',
      firstName:     CHECKOUT_INFO.firstName,
      lastName:      '',
      postalCode:    CHECKOUT_INFO.postalCode,
      expectedError: ERROR_MESSAGES.lastNameRequired,
    },
    {
      label:         'postal code missing',
      firstName:     CHECKOUT_INFO.firstName,
      lastName:      CHECKOUT_INFO.lastName,
      postalCode:    '',
      expectedError: ERROR_MESSAGES.postalCodeRequired,
    },
  ];

  for (const { label, firstName, lastName, postalCode, expectedError } of validationCases) {
    test(
      `Scenario 14 ${label}: shows validation error, user stays on step 1`,
      { tag: ['@regression', '@checkout', '@negative'] },
      async ({ checkoutInfoPage, page }) => {
        await checkoutInfoPage.fillInfo(firstName, lastName, postalCode);
        await checkoutInfoPage.continue();

        await expect(checkoutInfoPage.errorMessage).toBeVisible();
        await expect(checkoutInfoPage.errorMessage).toContainText(expectedError);
        await expect(page).toHaveURL(/checkout-step-one/);
      }
    );
  }

  test(
    'Scenario 17 Cancelling checkout returns to cart with all items still present',
    { tag: ['@regression', '@checkout'] },
    async ({ checkoutInfoPage, cartPage, page }) => {
      await checkoutInfoPage.cancel();

      await expect(page).toHaveURL(/cart\.html/);
      expect(await cartPage.getItemCount()).toBe(2);
    }
  );
});
