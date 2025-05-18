import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class EditPostPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  getTodaysDateWithCurrentTime() {
    return this.todaysDateWithCurrentTime();
  }

  async editPostWithCaptionImageLocation(
    caption: string,
    imagePath: string,
    location: string
  ) {
    await this.populateFieldsForPost(caption, imagePath, location);

    await this.page.getByRole("button", { name: "Update Post" }).click();
  }
}
