import { test, expect } from '@playwright/test'
import { createAxiosInstance } from './utils/axiosConfig'

test.describe('API Tests with Axios', () => {
    const baseURL = 'https://reqres.in/api'
    const axiosInstance = createAxiosInstance(baseURL)

    test('Get user details using Axios', async () => {
        try {
            const response = await axiosInstance.get('/users/2')

            // Status assertions
            expect(response.status).toBe(200)
            expect(response.statusText).toBe('OK')

            // Response data assertions
            expect(response.data.data).toBeTruthy()
            expect(response.data.data.email).toContain('janet')
            expect(response.data.data.first_name).toBe('Janet')

            // Response headers assertions
            expect(response.headers['content-type']).toContain(
                'application/json'
            )
        } catch (error) {
            console.error('Test failed:', error.message)
            throw error
        }
    })

    test('Create new user using Axios', async () => {
        const userData = {
            name: 'morpheus',
            job: 'leader',
        }

        try {
            const response = await axiosInstance.post('/users', userData)

            // Status assertions
            expect(response.status).toBe(201)

            // Response data assertions
            expect(response.data.name).toBe(userData.name)
            expect(response.data.job).toBe(userData.job)
            expect(response.data.id).toBeTruthy()
            expect(response.data.createdAt).toBeTruthy()
        } catch (error) {
            console.error('Test failed:', error.message)
            throw error
        }
    })

    test('Update user using Axios', async () => {
        const updatedData = {
            name: 'morpheus',
            job: 'zion resident',
        }

        try {
            const response = await axiosInstance.put('/users/2', updatedData)

            // Status assertions
            expect(response.status).toBe(200)

            // Response data assertions
            expect(response.data.name).toBe(updatedData.name)
            expect(response.data.job).toBe(updatedData.job)
            expect(response.data.updatedAt).toBeTruthy()
        } catch (error) {
            console.error('Test failed:', error.message)
            throw error
        }
    })
})
