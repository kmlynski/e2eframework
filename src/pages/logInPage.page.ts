import { Page } from 'playwright-core'

export default class LogInPage {
    private page: Page

    constructor(page: Page) {
        this.page = page
    }

    async enterUsername(username: string) {
        await this.page.locator('[data-test="username"]').fill(username)
    }

    async enterPassword(password: string) {
        await this.page.locator('[data-test="password"]').fill(password)
    }

    async clickLogIn() {
        await this.page.locator('[data-test="login-button"]').click()
    }
}
