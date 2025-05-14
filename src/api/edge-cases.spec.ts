import { test, expect } from '@playwright/test'
import { createAxiosInstance } from './utils/axiosConfig'
import axios, { AxiosError } from 'axios'
import {
    EDGE_CASES_DATA,
    generateLargePayload,
} from './test-data/edgeCasesData'

test.describe('API Edge Cases - Users Endpoint', () => {
    const baseURL = 'https://reqres.in/api'
    const axiosInstance = createAxiosInstance(baseURL)

    test('1. Rate Limiting - Multiple Rapid Requests', async () => {
        // Make 10 concurrent requests
        const requests = Array(10)
            .fill(null)
            .map(() => axiosInstance.get('/users'))

        try {
            const responses = await Promise.all(requests)
            // If all succeed, verify they're valid
            responses.forEach((response) => {
                expect(response.status).toBe(200)
                expect(response.data.data).toBeTruthy()
            })
        } catch (error) {
            // Rate limiting should return 429
            const axiosError = error as AxiosError
            expect(axiosError.response?.status).toBe(429)
        }
    })

    test.describe('2. Invalid User Data - Malformed JSON', () => {
        test('should handle null job value', async () => {
            const response = await axiosInstance.post(
                '/users',
                EDGE_CASES_DATA.invalidUserData
            )
            expect(response.status).toBe(201)
            expect(response.data.id).toBeTruthy()
            expect(response.data.createdAt).toBeTruthy()
            expect(response.data.name).toBe(
                EDGE_CASES_DATA.invalidUserData.name
            )
            expect(response.data.job).toBeNull()
        })
    })

    test.describe('3. Empty Fields - Null and Whitespace', () => {
        EDGE_CASES_DATA.emptyFields.forEach((testCase) => {
            const testName =
                testCase.name === null
                    ? 'null name'
                    : testCase.name === ''
                    ? 'empty string name'
                    : testCase.name === '   '
                    ? 'whitespace name'
                    : testCase.job === null
                    ? 'null job'
                    : testCase.job === ''
                    ? 'empty job string'
                    : 'whitespace job'

            test(`should handle ${testName} in payload`, async () => {
                const response = await axiosInstance.post('/users', testCase)
                expect(response.status).toBe(201)
                expect(response.data.id).toBeTruthy()

                if (testCase.name !== null) {
                    expect(response.data.name).toBe(testCase.name)
                }
                if (testCase.job !== null) {
                    expect(response.data.job).toBe(testCase.job)
                }
            })
        })
    })

    test.describe('4. Large Payload - Maximum Size', () => {
        test('should handle 10KB payload', async () => {
            const largePayload = generateLargePayload(10000)
            try {
                const response = await axiosInstance.post(
                    '/users',
                    largePayload
                )
                expect(response.status).toBe(201)
                expect(response.data.name).toBe(largePayload.name)
            } catch (error) {
                const axiosError = error as AxiosError
                expect(axiosError.response?.status).toBe(413) // Payload Too Large
            }
        })
    })

    test.describe('5. Special Characters - Unicode and Emojis', () => {
        test('should handle special characters in payload', async () => {
            const response = await axiosInstance.post(
                '/users',
                EDGE_CASES_DATA.specialCharacters
            )
            expect(response.status).toBe(201)
            expect(response.data.name).toBe(
                EDGE_CASES_DATA.specialCharacters.name
            )
            expect(response.data.job).toBe(
                EDGE_CASES_DATA.specialCharacters.job
            )
        })
    })

    test.describe('6. Non-existent Users - Invalid IDs', () => {
        EDGE_CASES_DATA.invalidIds.forEach((id) => {
            test(`should handle invalid ID: ${id}`, async () => {
                try {
                    await axiosInstance.get(`/users/${id}`)
                    throw new Error('Should have failed')
                } catch (error) {
                    const axiosError = error as AxiosError
                    expect(axiosError.response?.status).toBe(404)
                }
            })
        })

        test('should handle empty ID path', async () => {
            const emptyIdResponse = await axiosInstance.get('/users/')
            expect(emptyIdResponse.status).toBe(200)
            expect(emptyIdResponse.data.data).toBeTruthy()
        })
    })

    test.describe('7. Concurrent Operations - Create and Update', () => {
        test('should handle multiple concurrent user creations', async () => {
            const createRequests = Array(5)
                .fill(null)
                .map((_, index) =>
                    axiosInstance.post('/users', {
                        name: `Concurrent User ${index}`,
                        job: `Job ${index}`,
                    })
                )

            const responses = await Promise.all(createRequests)
            responses.forEach((response) => {
                expect(response.status).toBe(201)
                expect(response.data.id).toBeTruthy()
            })
        })
    })

    test.describe('8. Network Issues - Timeout Handling', () => {
        test('should handle request timeout', async () => {
            const timeoutInstance = axios.create(EDGE_CASES_DATA.timeoutConfig)

            try {
                await timeoutInstance.get('/users?delay=5')
                throw new Error('Should have timed out')
            } catch (error) {
                const axiosError = error as AxiosError
                expect(axiosError.code).toBe('ECONNABORTED')
                expect(axiosError.message).toContain('timeout')
            }
        })
    })

    test.describe('9. Authentication - Invalid API Key', () => {
        test('should handle invalid API key', async () => {
            const invalidAuthInstance = axios.create(
                EDGE_CASES_DATA.invalidAuthConfig
            )

            try {
                await invalidAuthInstance.post('/users', {
                    name: 'Test',
                    job: 'Test',
                })
                throw new Error('Should have failed')
            } catch (error) {
                const axiosError = error as AxiosError
                expect(axiosError.response?.status).toBe(401)
            }
        })
    })

    test.describe('10. Data Type Boundaries', () => {
        EDGE_CASES_DATA.boundaryTests.forEach((testData, index) => {
            const testName = testData.name.includes('x'.repeat(256))
                ? 'long string (256 chars)'
                : typeof testData.job === 'object'
                ? Array.isArray(testData.job)
                    ? 'array value'
                    : 'object value'
                : `${typeof testData.job} value`

            test(`should handle ${testName} in job field - case ${
                index + 1
            }`, async () => {
                const response = await axiosInstance.post('/users', testData)
                expect(response.status).toBe(201)
                expect(response.data.id).toBeTruthy()
                expect(response.data.createdAt).toBeTruthy()
                expect(response.data.name).toBe(testData.name)

                if (typeof testData.job !== 'object') {
                    expect(response.data.job).toBe(testData.job)
                } else {
                    expect(response.data.job).toBeTruthy()
                }
            })
        })
    })
})
