import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import data from "./images.json" assert { type: "json" };

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("create posts", async ({ page }) => {
  const pm = new PageManager(page);
  const todaysDate = pm.onCreatePostPage().getTodaysDateWithCurrentTime();
  const postCaption = `Automation Caption ${todaysDate}`;

  for (const image of data.images) {
    await pm.navigateTo().createPostPage();

    await pm
      .onCreatePostPage()
      .createPostWithCaptionImageLocation(
        postCaption,
        image.path,
        image.location
      );

    await expect(page.getByTestId("home-post-caption").first()).toContainText(
      postCaption
    );

    await expect(page.getByTestId("home-post-tags").first()).toContainText(
      image.hashtags
    );
  }
});

test("edit a post", async ({ page }) => {
  const pm = new PageManager(page);
  const todaysDate = pm.onEditPostPage().getTodaysDateWithCurrentTime();
  const postCaption = `Automation Edit ${todaysDate}`;
  const dogImg = data.images[0];

  await pm.navigateTo().userProfilePage();
  await pm.onProfilePage().openTheFirstPost();
  await pm.onPostPage().editPost();

  await pm
    .onEditPostPage()
    .editPostWithCaptionImageLocation(
      postCaption,
      dogImg.path,
      dogImg.location
    );

  await expect(page.locator(".post-caption")).toContainText(postCaption);

  await expect(page.getByTestId("post-details-tags").first()).toContainText(
    dogImg.hashtags
  );
});

test("like a post", async ({ page }) => {
  const pm = new PageManager(page);

  await page.locator(".home-posts").getByAltText("post image").first().click();

  const initialLikes = await pm.onPostPage().getLikeCount();
  const isLiked = await pm.onPostPage().isPostLiked();

  await pm.onPostPage().likePost();

  const updatedLikes = await pm.onPostPage().getLikeCount();

  if (isLiked) {
    expect(updatedLikes).toEqual(initialLikes - 1);
  } else {
    expect(updatedLikes).toEqual(initialLikes + 1);
  }
});

test("save a post", async ({ page }) => {
  const pm = new PageManager(page);

  await page.locator(".home-posts").getByAltText("post image").first().click();

  const postURLFromHome = page.url();
  const postPath = new URL(postURLFromHome).pathname;

  await pm.onPostPage().savePost();

  await pm.navigateTo().savedPage();

  const savedPost = page.locator(`.grid-container li a[href='${postPath}']`);

  await expect(savedPost).toBeVisible();
  await savedPost.click();

  const postURLFromSaved = page.url();

  expect(postURLFromHome).toEqual(postURLFromSaved);
});

test("delete a post", async ({ page }) => {
  const pm = new PageManager(page);
  const randomNumber = Math.floor(Math.random() * 1000);
  const postCaption = `Delete Me ${randomNumber}`;
  const deleteImg = data.images[1];

  await pm.navigateTo().createPostPage();

  await pm
    .onCreatePostPage()
    .createPostWithCaptionImageLocation(
      postCaption,
      deleteImg.path,
      deleteImg.location
    );

  await page.getByText(postCaption).click();
  await pm.onPostPage().deletePost();

  await expect(
    page.locator(".home-posts").getByText(postCaption)
  ).not.toBeVisible();
});

test("search for a post", async ({ page }) => {
  const pm = new PageManager(page);
  const searchCaption = "Automation Caption";
  const negativeSearchCaption = "NonExistentPost";

  await pm.navigateTo().explorePage();

  await pm.onExplorePage().searchForPostByCaption(searchCaption);

  await page.locator(".grid-container li").first().click();

  await expect(page.locator(".post-caption")).toContainText(searchCaption);

  await pm.onPostPage().clickBackButton();

  await pm.onExplorePage().searchForPostByCaption(negativeSearchCaption);

  await expect(page.getByText("No results found")).toBeVisible();
});

test("edit profile", async ({ page }) => {
  const pm = new PageManager(page);

  const newName = "Test Name Edit";
  const newBio = "Test Bio123!@# Edit";

  await pm.navigateTo().userProfilePage();

  await pm.onProfilePage().clickEditProfileButton();

  await pm
    .onEditProfilePage()
    .editProfileWithNewAvatarNameBio(
      "./test-data/test-avatar.jpg",
      newName,
      newBio
    );

  await expect(page.locator(".profile-name")).toHaveText(newName);
  await expect(page.locator(".profile-bio")).toHaveText(newBio);
});

test.describe("Sign Up", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
  });

  test("create a new account", async ({ page }) => {
    const pm = new PageManager(page);
    const todaysDate = pm.onSignUpPage().getTodaysDateWithCurrentTime();

    const name = `Test User ${todaysDate}`;
    const username = `test${todaysDate}`;
    const userEmail = `${username}@test.com`;
    const password = "Test1234!";

    if (await page.getByRole("heading", { name: "Home Feed" }).isVisible()) {
      await pm.navigateTo().logout();
    }

    await page.getByRole("link", { name: "Sign up" }).click();

    await pm
      .onSignUpPage()
      .populateNameUsernameEmailPasswordClickSignUp(
        name,
        username,
        userEmail,
        password
      );

    await expect(page.locator(".current-user-profile")).toHaveText(
      `${name}@${username}`
    );

    await pm.navigateTo().logout();

    await pm.onLogInPage().populateEmailPasswordClickLogIn(userEmail, password);

    await expect(page.locator(".current-user-profile")).toHaveText(
      `${name}@${username}`
    );
  });
});
