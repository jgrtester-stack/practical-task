import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton  = page.locator('#finish');
    this.cancelButton  = page.locator('#cancel');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel      = page.locator('.summary_tax_label');
    this.totalLabel    = page.locator('.summary_total_label');
  }

  async goto(): Promise<void> {
    await this.navigate('/checkout-step-two.html');
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
