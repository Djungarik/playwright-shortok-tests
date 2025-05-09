import { Page } from "@playwright/test";

export class PostPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async savePost() {
    const saveButton = this.page.getByAltText("share");

    if ((await saveButton.getAttribute("src")) === "/assets/icons/save.svg") {
      await saveButton.click();
    }
  }

  async deletePost() {
    await this.page.getByAltText("delete").click();
  }

  async editPost() {
    await this.page.getByAltText("edit").click();
  }

  async likePost() {
    await this.page.getByAltText("like").click();
  }

  async getLikeCount() {
    const likeCounter = this.page.locator(".likeCounter");
    const countText = await likeCounter.textContent();
    return parseInt(countText || "0");
  }

  async isPostLiked() {
    const likeButton = this.page.getByAltText("like");
    return (await likeButton.getAttribute("src")) === "/assets/icons/liked.svg";
  }
}
