import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { CreatePostPage } from "./createPostPage";
import { EditProfilePage } from "./editProfilePage";

export class PageManager {
  private readonly page: Page;
  private readonly navigationPage: NavigationPage;
  private readonly createPostPage: CreatePostPage;
  private readonly editProfilePage: EditProfilePage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.createPostPage = new CreatePostPage(this.page);
    this.editProfilePage = new EditProfilePage(this.page);
  }

  navigateTo() {
    return this.navigationPage;
  }

  onCreatePostPage() {
    return this.createPostPage;
  }

  onEditProfilePage() {
    return this.editProfilePage;
  }
}
