import { Page } from "@playwright/test";

export class ExplorePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async searchForPostByCaption(postCaption: string) {
    await this.page
      .getByPlaceholder("Search by caption, tags")
      .fill(postCaption);
  }
}
