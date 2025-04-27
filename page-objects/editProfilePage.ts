import { Page } from "@playwright/test";

export class EditProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async editProfileWithNewAvatarNameBio(
    avatarPath: string,
    newName: string,
    newBio: string
  ) {
    await this.page.setInputFiles('input[type="file"]', avatarPath);

    await this.page.locator('input[name="name"]:not([disabled])').clear();
    await this.page.getByLabel("Bio").clear();

    await this.page.locator('input[name="name"]:not([disabled])').fill(newName);
    await this.page.getByLabel("Bio").fill(newBio);

    await this.page.getByRole("button", { name: "Update Profile" }).click();
  }
}
