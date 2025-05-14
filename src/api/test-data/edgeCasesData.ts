import { AxiosRequestConfig } from 'axios'
import { API_CONFIG } from '../config/testConfig'

// Helper function to generate large payload
export const generateLargePayload = (size: number) => ({
    name: 'A'.repeat(size),
    job: 'B'.repeat(size),
})

export const EDGE_CASES_DATA = {
    emptyFields: [
        { name: null, job: 'developer' },
        { name: '', job: 'developer' },
        { name: '   ', job: 'developer' },
        { name: 'John', job: null },
        { name: 'John', job: '' },
        { name: 'John', job: '   ' },
    ],

    invalidUserData: {
        name: 'Test User',
        job: null,
    },

    specialCharacters: {
        name: '🧪 Test User 测试 مستخدم',
        job: '👨‍💻 Software Engineer £€$',
    },

    invalidIds: ['999999', '0', '-1', 'abc'],

    boundaryTests: [
        { name: 'x'.repeat(256), job: 'Test' }, // Very long string
        { name: 'Number Test', job: 456 }, // Number
        { name: 'Boolean Test', job: true }, // Boolean
        { name: 'Array Test', job: ['a', 'b', 'c'] }, // Array
        { name: 'Date Test', job: new Date().toISOString() }, // Date as ISO string
    ],

    timeoutConfig: {
        baseURL: API_CONFIG.baseURL,
        timeout: 1, // 1ms timeout (unrealistic, will force timeout)
        headers: API_CONFIG.headers,
    } as AxiosRequestConfig,

    invalidAuthConfig: {
        baseURL: API_CONFIG.baseURL,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'invalid-key',
        },
    } as AxiosRequestConfig,
}
