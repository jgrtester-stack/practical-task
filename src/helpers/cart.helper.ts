import { InventoryPage } from '../pages/InventoryPage';

/**
 * Shared cart setup helper.
 *
 * Adds one or more products to the cart without navigating away.
 * Assumes the page is already on /inventory.html
 * (guaranteed when called after the loggedIn fixture has resolved).
 *
 * Keeping this logic here avoids copy-pasting addToCart loops across
 * multiple beforeEach blocks.
 */
export async function addProductsToCart(
  inventoryPage: InventoryPage,
  productNames: readonly string[],
): Promise<void> {
  for (const name of productNames) {
    await inventoryPage.addToCart(name);
  }
}
