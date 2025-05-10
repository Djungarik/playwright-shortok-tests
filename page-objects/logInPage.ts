import { Page } from "@playwright/test";

export class LogInPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async populateEmailPasswordClickLogIn(userEmail: string, password: string) {
    await this.page.getByLabel("Email").fill(userEmail);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Log in" }).click();
  }
}
