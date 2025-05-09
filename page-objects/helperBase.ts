import { Page } from "@playwright/test";

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillFieldsForPost(
    caption: string,
    imagePath: string,
    location: string
  ) {
    await this.page.getByLabel("Caption").fill(caption);
    await this.page.setInputFiles('input[type="file"]', imagePath);
    await this.page.getByLabel("Add Location").fill(location);
  }
}
