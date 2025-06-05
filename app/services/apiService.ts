import axios from 'axios';

// Base URL for the main API
const API_BASE_URL = 'https://api.example.com';

// Create an axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // 15 seconds
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle network errors gracefully
        if (error.message === 'Network Error') {
            console.error('Network error detected.');
            return Promise.reject(error);
        }

        // Handle rate limiting
        if (error.response && error.response.status === 429) {
            console.error('Rate limit exceeded.');
            return Promise.reject(error);
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout.');
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// Generic function to fetch data from the API
export const fetchData = async <T>(endpoint: string, params?: any): Promise<T> => {
    try {
        const response = await apiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw error;
    }
};

// Generic function to post data to the API
export const postData = async <T>(endpoint: string, data: any): Promise<T> => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`Error posting data to ${endpoint}:`, error);
        throw error;
    }
}; 