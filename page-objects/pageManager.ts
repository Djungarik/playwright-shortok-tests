import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { CreatePostPage } from "./createPostPage";
import { EditPostPage } from "./editPostPage";
import { EditProfilePage } from "./editProfilePage";
import { PostPage } from "./postPage";
import { ExplorePage } from "./explorePage";
import { ProfilePage } from "./profilePage";
import { SignUpPage } from "./signUpPage";
import { LogInPage } from "./logInPage";

export class PageManager {
  private readonly page: Page;
  private readonly navigationPage: NavigationPage;
  private readonly createPostPage: CreatePostPage;
  private readonly editPostPage: EditPostPage;
  private readonly editProfilePage: EditProfilePage;
  private readonly postPage: PostPage;
  private readonly explorePage: ExplorePage;
  private readonly profilePage: ProfilePage;
  private readonly signUpPage: SignUpPage;
  private readonly logInPage: LogInPage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.createPostPage = new CreatePostPage(this.page);
    this.editPostPage = new EditPostPage(this.page);
    this.editProfilePage = new EditProfilePage(this.page);
    this.postPage = new PostPage(this.page);
    this.explorePage = new ExplorePage(this.page);
    this.profilePage = new ProfilePage(this.page);
    this.signUpPage = new SignUpPage(this.page);
    this.logInPage = new LogInPage(this.page);
  }

  navigateTo() {
    return this.navigationPage;
  }

  onCreatePostPage() {
    return this.createPostPage;
  }

  onEditPostPage() {
    return this.editPostPage;
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

  onProfilePage() {
    return this.profilePage;
  }

  onSignUpPage() {
    return this.signUpPage;
  }

  onLogInPage() {
    return this.logInPage;
  }
}
