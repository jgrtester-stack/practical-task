import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly completeMessage: Locator;
  readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeMessage = page.locator('.complete-header');
    this.completeText    = page.locator('.complete-text');
    this.backHomeButton  = page.locator('#back-to-products');
  }

  async goto(): Promise<void> {
    await this.navigate('/checkout-complete.html');
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
