/**
 * Section B – Product Inventory
 * Tags: @inventory @smoke
 *
 * All tests use inventoryPage (which depends on loggedIn) — UI login.
 * beforeEach navigates to /inventory.html for a clean start.
 */
import { test, expect } from '../fixtures/auth.fixture';
import { PRODUCTS, PRODUCT_DETAILS } from '../utils/test-data';

test.describe('Section B – Product Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test(
    'Scenario 4 Add a product to the cart from inventory - a product changes button to Remove and sets badge to 1',
    { tag: ['@smoke', '@regression', '@inventory'] },
    async ({ inventoryPage }) => {
      await inventoryPage.addToCart(PRODUCTS.backpack);

      expect(await inventoryPage.isRemoveVisible(PRODUCTS.backpack)).toBe(true);
      expect(await inventoryPage.isAddToCartVisible(PRODUCTS.backpack)).toBe(false);
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    }
  );

  test(
    'Scenario 6 Add multiple products and verify cart badge - 3 products shows badge = 3 and all 3 buttons in Remove state',
    { tag: ['@regression', '@inventory'] },
    async ({ inventoryPage }) => {
      const products = [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.boltTshirt] as const;

      for (const p of products) {
        await inventoryPage.addToCart(p);
      }

      expect(await inventoryPage.getCartBadgeCount()).toBe(3);
      for (const p of products) {
        expect(await inventoryPage.isRemoveVisible(p)).toBe(true);
      }
    }
  );

  test(
    'Scenario 7 Remove a product from inventory page - one of two products reverts its button and decrements badge to 1',
    { tag: ['@regression', '@inventory'] },
    async ({ inventoryPage }) => {
      for (const p of [PRODUCTS.backpack, PRODUCTS.bikeLight]) {
        await inventoryPage.addToCart(p);
      }

      await inventoryPage.removeFromCart(PRODUCTS.backpack);

      expect(await inventoryPage.isAddToCartVisible(PRODUCTS.backpack)).toBe(true);
      expect(await inventoryPage.isRemoveVisible(PRODUCTS.backpack)).toBe(false);
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    }
  );

  test(
    'Scenario 7 (edge case) Remove the only cart item hides the badge entirely',
    { tag: ['@regression', '@inventory'] },
    async ({ inventoryPage }) => {
      await inventoryPage.addToCart(PRODUCTS.backpack);
      await inventoryPage.removeFromCart(PRODUCTS.backpack);

      expect(await inventoryPage.isCartBadgeVisible()).toBe(false);
    }
  );

  test(
    'Scenario 8 Navigate to product detail page - click and open detail page with correct name, description, price and add-to-cart',
    { tag: ['@regression', '@inventory'] },
    async ({ inventoryPage, page }) => {
      await inventoryPage.clickProduct(PRODUCTS.backpack);

      await expect(page).toHaveURL(/inventory-item\.html/);
      await expect(page.getByTestId('inventory-item-name')).toHaveText(PRODUCT_DETAILS.backpack.name);
      await expect(page.getByTestId('inventory-item-desc')).toContainText(PRODUCT_DETAILS.backpack.descriptionFragment);
      await expect(page.getByTestId('inventory-item-price')).toHaveText(PRODUCT_DETAILS.backpack.price);
      await expect(page.getByTestId('add-to-cart')).toBeVisible();
    }
  );
});
