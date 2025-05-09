import { test as setup } from "@playwright/test";
const authFile = ".auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email").fill("test2025040601@test.com");
  await page.getByLabel("Password").fill("Test1234");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});
