import axios from 'axios';

const api = axios.create({
    baseURL: 'http://api.wisey.app/api/v1/core',
});

async function getToken() {
    try {
        const response = await axios.get('http://api.wisey.app/api/v1/auth/anonymous?platform=subscriptions')
        const token = response.data.token;
        localStorage.setItem('v-token', token);
        return token;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
}

api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('v-token');
        if (!token) {
            token = await getToken();
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('v-token');
            const token = await getToken();
            error.config.headers.Authorization = `Bearer ${token}`;
            return api.request(error.config);
        } else {
            return Promise.reject(error);
        }
    }
);


export default api;
