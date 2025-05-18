import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class SignUpPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  getTodaysDateWithCurrentTime() {
    return this.todaysDateWithCurrentTime();
  }

  async populateNameUsernameEmailPasswordClickSignUp(
    name: string,
    username: string,
    userEmail: string,
    password: string
  ) {
    await this.page.getByLabel("Name", { exact: true }).fill(name);
    await this.page.getByLabel("Username").fill(username);
    await this.page.getByLabel("Email").fill(userEmail);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Sign Up" }).click();
  }
}
