/**
 * Section F – End-to-End Composite Journey
 * Tags: @regression @e2e
 */
import { test, expect } from '../fixtures/auth.fixture';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { USERS, PRODUCTS, CHECKOUT_INFO } from '../utils/test-data';

test.describe('Section F – End-to-End Composite Journey', () => {
  test(
    'Scenario 18 Full purchase journey: login → add/remove products → checkout → confirm → empty cart',
    { tag: ['@regression', '@e2e'] },
    async ({ page, loginPage }) => {
      const inventoryPage        = new InventoryPage(page);
      const cartPage             = new CartPage(page);
      const checkoutInfoPage     = new CheckoutInfoPage(page);
      const checkoutOverviewPage = new CheckoutOverviewPage(page);
      const checkoutCompletePage = new CheckoutCompletePage(page);

      // 1. Login via UI
      await loginPage.goto();
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await expect(page).toHaveURL(/inventory\.html/);

      // 2. Add 3 products
      await inventoryPage.addToCart(PRODUCTS.backpack);
      await inventoryPage.addToCart(PRODUCTS.bikeLight);
      await inventoryPage.addToCart(PRODUCTS.boltTshirt);
      expect(await inventoryPage.getCartBadgeCount()).toBe(3);

      //  3. Remove 1 product
      await inventoryPage.removeFromCart(PRODUCTS.boltTshirt);
      expect(await inventoryPage.getCartBadgeCount()).toBe(2);
      expect(await inventoryPage.isAddToCartVisible(PRODUCTS.boltTshirt)).toBe(true);

      // 4. Verify cart contents
      await inventoryPage.goToCart();
      const cartItems = await cartPage.getItemNames();
      expect(cartItems).toHaveLength(2);
      expect(cartItems).toContain(PRODUCTS.backpack);
      expect(cartItems).toContain(PRODUCTS.bikeLight);
      expect(cartItems).not.toContain(PRODUCTS.boltTshirt);
      await expect(cartPage.cartItem(PRODUCTS.backpack).getByTestId('inventory-item-price')).toHaveText('$29.99');
      await expect(cartPage.cartItem(PRODUCTS.bikeLight).getByTestId('inventory-item-price')).toHaveText('$9.99');

      // 5. Continue Shopping — assert return and badge preserved
      await cartPage.continueShopping();
      await expect(page).toHaveURL(/inventory\.html/);
      expect(await inventoryPage.getCartBadgeCount()).toBe(2);

      // 6. Navigate back to cart and proceed to checkout
      await inventoryPage.goToCart();
      expect(await cartPage.getItemCount()).toBe(2);
      await cartPage.checkout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      // 7. Fill checkout information 
      await checkoutInfoPage.fillInfo(
        CHECKOUT_INFO.firstName,
        CHECKOUT_INFO.lastName,
        CHECKOUT_INFO.postalCode,
      );
      await checkoutInfoPage.continue();
      await expect(page).toHaveURL(/checkout-step-two\.html/);

      // 8. Verify order summary 
      const overviewItems = await checkoutOverviewPage.getItemNames();
      expect(overviewItems).toContain(PRODUCTS.backpack);
      expect(overviewItems).toContain(PRODUCTS.bikeLight);
      await expect(checkoutOverviewPage.subtotalLabel).toContainText('Item total: $39.98');
      await expect(checkoutOverviewPage.taxLabel).toContainText('Tax:');
      await expect(checkoutOverviewPage.totalLabel).toContainText('Total: $43.18');

      // 9. Complete purchase 
      await checkoutOverviewPage.finish();
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutCompletePage.completeMessage).toHaveText('Thank you for your order!');

      // 10. Cart is empty after purchase 
      await cartPage.goto();
      expect(await cartPage.getItemCount()).toBe(0);
      await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
    }
  );
});
