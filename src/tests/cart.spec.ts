/**
 * Section C – Shopping Cart
 * Tags: @cart @smoke
 */
import { test, expect } from '../fixtures/auth.fixture';
import { addProductsToCart } from '../helpers/cart.helper';
import { PRODUCTS } from '../utils/test-data';

test.describe('Section C – Shopping Cart', () => {
  test(
    'Scenario 11 Cart lists exactly the 2 added products with correct name, description, price and quantity',
    { tag: ['@smoke', '@regression', '@cart'] },
    async ({ inventoryPage, cartPage }) => {
      await addProductsToCart(inventoryPage, [PRODUCTS.backpack, PRODUCTS.bikeLight]);
      await inventoryPage.goToCart();

      const names = await cartPage.getItemNames();
      expect(names).toHaveLength(2);
      expect(names).toContain(PRODUCTS.backpack);
      expect(names).toContain(PRODUCTS.bikeLight);

      for (const name of [PRODUCTS.backpack, PRODUCTS.bikeLight]) {
        await expect(cartPage.cartItem(name).locator('.inventory_item_desc')).not.toBeEmpty();
        await expect(cartPage.cartItem(name).locator('.inventory_item_price')).toContainText('$');
        await expect(cartPage.cartItem(name).locator('.cart_quantity')).toHaveText('1');
      }
    }
  );

  test(
    'Scenario 12 Continue Shopping returns to inventory with cart items still intact',
    { tag: ['@regression', '@cart'] },
    async ({ inventoryPage, cartPage, page }) => {
      await addProductsToCart(inventoryPage, [PRODUCTS.backpack]);
      await inventoryPage.goToCart();

      await cartPage.continueShopping();

      await expect(page).toHaveURL(/inventory\.html/);
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
      expect(await inventoryPage.isRemoveVisible(PRODUCTS.backpack)).toBe(true);
    }
  );
});
