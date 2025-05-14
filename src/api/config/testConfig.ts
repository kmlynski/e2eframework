import { APIRequestContext } from '@playwright/test'

export const API_CONFIG = {
    baseURL: 'https://reqres.in/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY || 'reqres-free-v1',
    },
}

export const TEST_DATA = {
    validUser: {
        id: 2,
        email: 'janet.weaver@reqres.in',
        firstName: 'Janet',
        lastName: 'Weaver',
    },
    newUser: {
        name: 'morpheus',
        job: 'leader',
    },
}

export const ENDPOINTS = {
    users: '/users',
    singleUser: (id: number) => `/users/${id}`,
    register: '/register',
    login: '/login',
}

export interface TestContext {
    request: APIRequestContext
}
