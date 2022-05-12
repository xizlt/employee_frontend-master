import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    accessToken: null,
    refreshToken: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})
