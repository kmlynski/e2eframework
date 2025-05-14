import axios, { AxiosInstance } from 'axios'
import {
    setupResponseInterceptors,
    setupRequestInterceptors,
} from './axiosInterceptors'

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'reqres-free-v1',
        },
    })

    // Setup interceptors
    setupResponseInterceptors(axiosInstance)
    setupRequestInterceptors(axiosInstance)

    return axiosInstance
}
