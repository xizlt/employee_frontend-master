import {useState, useCallback, useEffect} from 'react'
import axiosInstance from "../service/axcio";

const TIMING = 60000 * 80
export const useAuth = () => {
    const [accessToken, setAccessToken] = useState(null)
    const [ready, setReady] = useState(false)

    const login = useCallback((jwtToken) => {
        localStorage.setItem('access_token', jwtToken.access);
        localStorage.setItem('refresh_token', jwtToken.refresh);
        axiosInstance.defaults.headers['Authorization'] =
            'JWT ' + localStorage.getItem('access_token');
        setAccessToken(jwtToken.access)
        setTimeout(() => logout(), TIMING);
    }, [])

    const logout = useCallback(() => {
        const response = axiosInstance.post('token/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        setAccessToken(null)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        axiosInstance.defaults.headers['Authorization'] = null;
    }, [])


    useEffect(() => {
        const data = {
            access: localStorage.getItem('access_token'),
            refresh: localStorage.getItem('refresh_token'),
        }
        if (data.access) {
            login(data)
        }
        setReady(true)
    }, [login])


    return { login, logout, accessToken, ready }
}
