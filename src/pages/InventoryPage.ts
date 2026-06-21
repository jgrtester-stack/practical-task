import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBadge = page.locator('#shopping_cart_container .shopping_cart_badge');
    this.cartLink  = page.locator('#shopping_cart_container .shopping_cart_link');
  }

  async goto(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  async addToCart(productName: string): Promise<void> {
    await this.productItem(productName)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.productItem(productName)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async isAddToCartVisible(productName: string): Promise<boolean> {
    return this.productItem(productName)
      .getByRole('button', { name: 'Add to cart' })
      .isVisible();
  }

  async isRemoveVisible(productName: string): Promise<boolean> {
    return this.productItem(productName)
      .getByRole('button', { name: 'Remove' })
      .isVisible();
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isVisible();
  }

  async clickProduct(productName: string): Promise<void> {
    await this.productItem(productName)
      .getByTestId('inventory-item-name')
      .click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  private productItem(productName: string): Locator {
    return this.page
      .getByTestId('inventory-item')
      .filter({ hasText: productName });
  }
}
