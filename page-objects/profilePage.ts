import { Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickEditProfileButton() {
    await this.page
      .locator(".profile-inner_container")
      .getByText("Edit Profile")
      .click();
  }

  async openTheFirstPost() {
    await this.page.locator(".grid-container li").first().click();
  }
}
