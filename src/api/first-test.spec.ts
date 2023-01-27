import { test, expect } from '@playwright/test'

test('Get user details', async ({ request }) => {
    const userDetails = await request.get(`https://reqres.in/api/users/2`)
    expect(userDetails.ok()).not.toBeTruthy()
    expect(userDetails.status()).toBe(200)
    const result = await userDetails.json()
    expect(result.data.email).toContain('janet')
    expect(result.data.first_name).toBe('Janet')
})
