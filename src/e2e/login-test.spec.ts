import { test, expect } from '@playwright/test'
import LogInPage from '../pages/logInPage.page'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Log in on standard user test', async ({ page }) => {
    const loginPage = new LogInPage(page)

    await loginPage.enterUsername('standard_user')
    await loginPage.enterPassword('secret_sauce')
    await loginPage.clickLogIn()

    await expect.soft(page).toHaveURL('/inventory.html')
    await expect(page.locator('.app_logo')).toBeVisible()
})
