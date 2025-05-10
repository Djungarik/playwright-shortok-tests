import { Page } from "@playwright/test";

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  todaysDateWithRandomNumber() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    const randomNumber = Math.floor(Math.random() * 1000);
    const todaysDate = `${year}${month}${day}${randomNumber}`;

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
