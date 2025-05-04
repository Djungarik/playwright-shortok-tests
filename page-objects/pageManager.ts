import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { CreatePostPage } from "./createPostPage";
import { EditProfilePage } from "./editProfilePage";
import { PostPage } from "./postPage";
import { ExplorePage } from "./explorePage";

export class PageManager {
  private readonly page: Page;
  private readonly navigationPage: NavigationPage;
  private readonly createPostPage: CreatePostPage;
  private readonly editProfilePage: EditProfilePage;
  private readonly postPage: PostPage;
  private readonly explorePage: ExplorePage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.createPostPage = new CreatePostPage(this.page);
    this.editProfilePage = new EditProfilePage(this.page);
    this.postPage = new PostPage(this.page);
    this.explorePage = new ExplorePage(this.page);
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

  onPostPage() {
    return this.postPage;
  }

  onExplorePage() {
    return this.explorePage;
  }
}
