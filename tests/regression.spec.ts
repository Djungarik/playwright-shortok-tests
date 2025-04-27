import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { CreatePostPage } from "../page-objects/createPostPage";
import { EditProfilePage } from "../page-objects/editProfilePage";
import { on } from "events";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email").fill("test2025040601@test.com");
  await page.getByLabel("Password").fill("Test1234");
  await page.getByRole("button", { name: "Log in" }).click();
});

test("create a post", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  const onCreatePostPage = new CreatePostPage(page);

  await navigateTo.createPostPage();

  await onCreatePostPage.createPostWithCaptionImageLocation(
    "Test caption",
    "./test-data/test-image.jpg",
    "Test location"
  );

  await expect(page.getByTestId("home-post-caption").first()).toContainText(
    "Test caption"
  );

  await expect(page.getByTestId("home-post-tags").first()).toContainText(
    "#Facialexpression#Cartoon#Clipart#Fictionalcharacter#Graphics#Animatedcartoon#Animation"
  );
});

test("like a post", async ({ page }) => {
  await page.locator(".home-posts").getByAltText("post image").first().click();

  let likesCounter = await page.locator(".likeCounter").textContent();
  let likes = parseInt(likesCounter || "0");

  await page.getByAltText("like").click();

  expect(likes).toEqual(likes++);
});

test("save a post", async ({ page }) => {
  const navigateTo = new NavigationPage(page);

  await page.locator(".home-posts").getByAltText("post image").first().click();

  const postURLFromHome = page.url();

  await page.getByAltText("share").click();

  await navigateTo.savedPage();
  await page.locator(".grid-container li").first().click();

  const postURLFromSaved = page.url();

  expect(postURLFromHome).toEqual(postURLFromSaved);
});

test("delete a post", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  const onCreatePostPage = new CreatePostPage(page);

  await navigateTo.createPostPage();

  await onCreatePostPage.createPostWithCaptionImageLocation(
    "Delete Me",
    "./test-data/test-image.jpg",
    "Test location"
  );

  await page.waitForTimeout(1000);

  await page.getByText("Delete Me").click();
  await page.getByAltText("delete").click();

  await page.waitForTimeout(5000);

  await expect(page.getByText("Delete Me")).not.toBeAttached();
});

test("search for a post", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.explorePage();

  await page.getByPlaceholder("Search by caption, tags").fill("car");

  await page.locator(".grid-container li").first().click();

  await expect(page.locator(".post-caption")).toContainText("car");
});

test("edit profile", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  const onEditProfilePage = new EditProfilePage(page);

  const newName = "Test Name Edit";
  const newBio = "Test Bio123!@# Edit";

  await navigateTo.userProfilePage();

  await page
    .locator(".profile-inner_container")
    .getByText("Edit Profile")
    .click();

  await onEditProfilePage.editProfileWithNewAvatarNameBio(
    "./test-data/test-avatar.jpg",
    newName,
    newBio
  );

  await expect(page.locator(".profile-name")).toHaveText(newName);
  await expect(page.locator(".profile-bio")).toHaveText(newBio);
});

test("create a new account", async ({ page }) => {
  const navigateTo = new NavigationPage(page);

  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate();
  const randomNumber = Math.floor(Math.random() * 1000);

  const username = `test${year}${month}${day}${randomNumber}`;
  const userEmail = `${username}@test.com`;

  await navigateTo.logout();

  await page.getByRole("link", { name: "Sign up" }).click();

  await page.getByLabel("Name", { exact: true }).fill("Test User");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill("Test1234!");
  await page.getByRole("button", { name: "Sign Up" }).click();

  await expect(page.locator(".current-user-profile")).toHaveText(
    `Test User@${username}`
  );

  await navigateTo.logout();

  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill("Test1234!");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.locator(".current-user-profile")).toHaveText(
    `Test User@${username}`
  );
});
