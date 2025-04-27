import { Page } from "@playwright/test";

export class CreatePostPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createPostWithCaptionImageLocation(
    caption: string,
    imagePath: string,
    location: string
  ) {
    await this.page.getByLabel("Caption").fill(caption);
    await this.page.setInputFiles('input[type="file"]', imagePath);
    await this.page.getByLabel("Add Location").fill(location);
    await this.page.getByRole("button", { name: "Create Post" }).click();
  }
}
