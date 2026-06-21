import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutInfoPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput  = page.locator('#first-name');
    this.lastNameInput   = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton  = page.locator('#continue');
    this.cancelButton    = page.locator('#cancel');
    this.errorMessage    = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/checkout-step-one.html');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
