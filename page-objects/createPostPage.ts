import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class CreatePostPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  getTodaysDateWithRandomNumber() {
    return this.todaysDateWithRandomNumber();
  }

  async createPostWithCaptionImageLocation(
    caption: string,
    imagePath: string,
    location: string
  ) {
    await this.fillFieldsForPost(caption, imagePath, location);

    await this.page.getByRole("button", { name: "Create Post" }).click();
  }
}
