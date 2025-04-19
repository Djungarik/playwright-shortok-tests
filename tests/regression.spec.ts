import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email").fill("test2025040601@test.com");
  await page.getByLabel("Password").fill("Test1234");
  await page.getByRole("button", { name: "Log in" }).click();
});

test("create a post", async ({ page }) => {
  await page.locator(".leftsidebar").getByText("Create Post").click();

  await page.getByLabel("Caption").fill("Test caption");

  await page.setInputFiles('input[type="file"]', "./test-data/test-image.jpg");

  await page.getByLabel("Add Location").fill("Test location");

  await expect(page.getByPlaceholder("Art, Expression, Learn")).toHaveValue(
    "Facial expression,Cartoon,Clip art,Fictional character,Graphics,Animated cartoon,Animation"
  );

  await page.getByRole("button", { name: "Create Post" }).click();
});

test("like a post", async ({ page }) => {
  await page.locator(".home-posts").getByAltText("post image").first().click();

  let likesCounter = await page.locator(".likeCounter").textContent();
  let likes = parseInt(likesCounter || "0");

  await page.getByAltText("like").click();

  expect(likes).toEqual(likes++);
});

test("save a post", async ({ page }) => {
  await page.locator(".home-posts").getByAltText("post image").first().click();

  const postURLFromHome = page.url();

  await page.getByAltText("share").click();

  await page.locator(".leftsidebar").getByText("Saved").click();
  await page.locator(".grid-container li").first().click();

  const postURLFromSaved = page.url();

  expect(postURLFromHome).toEqual(postURLFromSaved);
});

test("delete a post", async ({ page }) => {
  await page.locator(".leftsidebar").getByText("Create Post").click();
  await page.getByLabel("Caption").fill("Delete Me");
  await page.setInputFiles('input[type="file"]', "./test-data/test-image.jpg");
  await page.getByLabel("Add Location").fill("Test location");
  await expect(page.getByPlaceholder("Art, Expression, Learn")).toHaveValue(
    "Facial expression,Cartoon,Clip art,Fictional character,Graphics,Animated cartoon,Animation"
  );
  await page.getByRole("button", { name: "Create Post" }).click();

  await page.waitForTimeout(1000);

  await page.getByText("Delete Me").click();
  await page.getByAltText("delete").click();

  await page.waitForTimeout(5000);

  await expect(page.getByText("Delete Me")).not.toBeAttached();
});

test("search for a post", async ({ page }) => {
  await page.locator(".leftsidebar").getByText("Explore").click();
  await page.getByPlaceholder("Search by caption, tags").fill("car");

  await page.locator(".grid-container li").first().click();

  await expect(page.locator(".post-caption")).toContainText("car");
});

test("edit profile", async ({ page }) => {
  const newName = "Test Name";
  const newBio = "Test Bio123!@#";

  await page.locator(".current-user-profile").click();

  await page
    .locator(".profile-inner_container")
    .getByText("Edit Profile")
    .click();

  await page.setInputFiles('input[type="file"]', "./test-data/test-avatar.jpg");

  await page.locator('input[name="name"]:not([disabled])').clear();
  await page.getByLabel("Bio").clear();

  await page.locator('input[name="name"]:not([disabled])').fill(newName);
  await page.getByLabel("Bio").fill(newBio);

  await page.getByRole("button", { name: "Update Profile" }).click();

  await expect(page.locator(".profile-name")).toHaveText(newName);
  await expect(page.locator(".profile-bio")).toHaveText(newBio);
});
