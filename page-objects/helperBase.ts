import { Page } from "@playwright/test";

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  todaysDateWithCurrentTime() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const currentTime = `${hours}${minutes}${seconds}`;

    const todaysDate = `${year}${month}${day}${currentTime}`;

    return todaysDate;
  }

  async populateFieldsForPost(
    caption: string,
    imagePath: string,
    location: string
  ) {
    await this.page.getByLabel("Caption").fill(caption);
    await this.page.setInputFiles('input[type="file"]', imagePath);
    await this.page.getByLabel("Add Location").fill(location);
  }
}
