import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email").fill("test2025040601@test.com");
  await page.getByLabel("Password").fill("Test1234");
  await page.getByRole("button", { name: "Log in" }).click();
});

test("create a post", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().createPostPage();

  await pm
    .onCreatePostPage()
    .createPostWithCaptionImageLocation(
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

  const likeButton = page.getByAltText("like");
  const likeCounter = page.locator(".likeCounter");

  const countText = await likeCounter.textContent();
  const initialLikes = parseInt(countText || "0");
  const isLiked =
    (await likeButton.getAttribute("src")) === "/assets/icons/liked.svg";

  await likeButton.click();

  const updatedCountText = await likeCounter.textContent();
  const updatedLikes = parseInt(updatedCountText || "0");

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
  const saveButton = page.getByAltText("share");

  if ((await saveButton.getAttribute("src")) === "/assets/icons/save.svg") {
    await saveButton.click();
  }

  await pm.navigateTo().savedPage();

  const savedPost = page.locator(`.grid-container li a[href='${postPath}']`);

  await expect(savedPost).toBeVisible();
  await savedPost.click();

  const postURLFromSaved = page.url();

  expect(postURLFromHome).toEqual(postURLFromSaved);
});

test("delete a post", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().createPostPage();

  await pm
    .onCreatePostPage()
    .createPostWithCaptionImageLocation(
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
  const pm = new PageManager(page);

  await pm.navigateTo().explorePage();

  await page.getByPlaceholder("Search by caption, tags").fill("car");

  await page.locator(".grid-container li").first().click();

  await expect(page.locator(".post-caption")).toContainText("car");
});

test("edit profile", async ({ page }) => {
  const pm = new PageManager(page);

  const newName = "Test Name Edit";
  const newBio = "Test Bio123!@# Edit";

  await pm.navigateTo().userProfilePage();

  await page
    .locator(".profile-inner_container")
    .getByText("Edit Profile")
    .click();

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

test("create a new account", async ({ page }) => {
  const pm = new PageManager(page);

  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate();
  const randomNumber = Math.floor(Math.random() * 1000);

  const username = `test${year}${month}${day}${randomNumber}`;
  const userEmail = `${username}@test.com`;

  await pm.navigateTo().logout();

  await page.getByRole("link", { name: "Sign up" }).click();

  await page.getByLabel("Name", { exact: true }).fill("Test User");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill("Test1234!");
  await page.getByRole("button", { name: "Sign Up" }).click();

  await expect(page.locator(".current-user-profile")).toHaveText(
    `Test User@${username}`
  );

  await pm.navigateTo().logout();

  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill("Test1234!");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.locator(".current-user-profile")).toHaveText(
    `Test User@${username}`
  );
});
