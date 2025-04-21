import { Page } from "@playwright/test";

export class NavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async userProfilePage() {
    await this.page.locator(".leftsidebar .current-user-profile").click();
  }
  async homePage() {
    await this.page.locator(".leftsidebar").getByText("Home").click();
  }
  async explorePage() {
    await this.page.locator(".leftsidebar").getByText("Explore").click();
  }
  async peoplePage() {
    await this.page.locator(".leftsidebar").getByText("People").click();
  }
  async savedPage() {
    await this.page.locator(".leftsidebar").getByText("Saved").click();
  }
  async createPostPage() {
    await this.page.locator(".leftsidebar").getByText("Create Post").click();
  }
  async logout() {
    await this.page.locator(".leftsidebar").getByText("Logout").click();
  }
}
