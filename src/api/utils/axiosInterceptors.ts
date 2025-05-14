import { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

export const setupResponseInterceptors = (
    axiosInstance: AxiosInstance
): void => {
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            console.log(`Request successful to ${response.config.url}`)
            return response
        },
        (error: AxiosError) => {
            console.error(
                `Request failed to ${error.config?.url}: ${error.message}`
            )
            return Promise.reject(error)
        }
    )
}

export const setupRequestInterceptors = (
    axiosInstance: AxiosInstance
): void => {
    axiosInstance.interceptors.request.use(
        (config) => {
            console.log(`Making request to ${config.url}`)
            return config
        },
        (error: AxiosError) => {
            console.error(`Request setup failed: ${error.message}`)
            return Promise.reject(error)
        }
    )
}
