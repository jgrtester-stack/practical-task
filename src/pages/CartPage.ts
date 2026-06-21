import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton         = page.locator('#checkout');
  }

  async goto(): Promise<void> {
    await this.navigate('/cart.html');
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async getItemCount(): Promise<number> {
    return this.page.locator('.cart_item').count();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  cartItem(productName: string): Locator {
    return this.page
      .locator('.cart_item')
      .filter({ hasText: productName });
  }
}
