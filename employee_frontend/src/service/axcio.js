import axios from 'axios';


const axiosInstance = axios.create({
    timeout: 5000,
    baseURL: 'http://localhost/api/v1/',
    headers: {
        Authorization: localStorage.getItem('access_token')
            ? 'JWT ' + localStorage.getItem('access_token')
            : null,
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "token/" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    let rs = await axiosInstance.post("token/refresh/", {
                        refresh: localStorage.getItem('refresh_token'),
                    });
                    let accessToken = rs.data;
                    localStorage.setItem('access_token', accessToken.access);
                    originalConfig.headers['Authorization'] = "JWT " + accessToken.access
                    return axiosInstance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(err);
    }
);
export default axiosInstance;
