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

test('Log in on locked user test', async ({ page }) => {
    const loginPage = new LogInPage(page)

    await loginPage.enterUsername('locked_out_user')
    await loginPage.enterPassword('secret_sauce')
    await loginPage.clickLogIn()

    await expect(page.locator('[data-test="error"]')).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.'
    )
})
