import { createContext, useReducer } from "react"
import axios from "axios"
import { authReducer } from "../reducers/authReducer"
import { LOCAL_STORAGE_TOKEN_NAME, apiUrl } from "./constants"

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null
    })

    // Login
    const loginUser = async userForm => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, userForm)
            if (response.data.success) {
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
            }
            return response.data
        } catch (error) {
            return error.response.data ? error.response.data : { success: false, message: error.message }
        }
    }

    // Context data
    const authContextData = { loginUser }

    // Return provider
    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider