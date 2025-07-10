import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    loginUser as apiLoginUser,
    registerUser as apiRegisterUser,
    getMe as apiGetMe,
    logoutUser as apiLogoutUser, // Assuming you'll add this to apiService
    updateUserDetails as apiUpdateUserDetails
} from '../services/apiService'; // Adjust path as needed

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true); // For initial auth check
    const [error, setError] = useState(null);

    // Effect to load user on initial app load if token exists
    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const response = await apiGetMe(token);
                    if (response.data && response.data.success) {
                        setUser(response.data.data);
                        localStorage.setItem('authUser', JSON.stringify(response.data.data)); // Keep localStorage in sync
                    } else {
                        // Token might be invalid or expired
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('authUser');
                        setToken(null);
                        setUser(null);
                    }
                } catch (err) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('authUser');
                    setToken(null);
                    setUser(null);
                    console.error("Initialization auth error:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // No token, not loading
            }
        };
        initializeAuth();
    }, [token]); // Re-run if token changes (e.g. after login)

    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiLoginUser(credentials);
            if (response.data && response.data.success && response.data.token) {
                setToken(response.data.token);
                setUser(response.data.user);
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('authUser', JSON.stringify(response.data.user));
                return response.data;
            } else {
                setError(response.data.message || 'Login failed.');
                throw new Error(response.data.message || 'Login failed.');
            }
        } catch (err) {
            setError(err.error || err.message || 'An error occurred during login.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiRegisterUser(userData);
            if (response.data && response.data.success && response.data.token) {
                setToken(response.data.token);
                setUser(response.data.user);
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('authUser', JSON.stringify(response.data.user));
                return response.data;
            } else {
                setError(response.data.message || 'Registration failed.');
                throw new Error(response.data.message || 'Registration failed.');
            }
        } catch (err) {
            setError(err.error || err.message || 'An error occurred during registration.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            if (token) {
                await apiLogoutUser(token); // Call backend logout if it exists and does something (e.g. invalidate session/token)
            }
        } catch (logoutError) {
            console.error("Backend logout error (token might already be invalid):", logoutError);
            // Still proceed with client-side logout
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setLoading(false);
            // Optionally redirect here or let component do it: navigate('/account/login');
        }
    }, [token]);

    const updateUser = useCallback(async (userData) => {
        if (!token) {
            setError("Not authenticated to update user.");
            throw new Error("Not authenticated to update user.");
        }
        try {
            setLoading(true);
            setError(null);
            const response = await apiUpdateUserDetails(userData, token);
            if (response.data && response.data.success) {
                setUser(response.data.data);
                localStorage.setItem('authUser', JSON.stringify(response.data.data));
                return response.data.data;
            } else {
                setError(response.data.message || "Failed to update user details.");
                throw new Error(response.data.message || "Failed to update user details.");
            }
        } catch (err) {
            setError(err.error || err.message || "An error occurred while updating details.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Function to refresh user data from backend
    const refreshUser = useCallback(async () => {
        if (token) {
            setLoading(true);
            try {
                const response = await apiGetMe(token);
                if (response.data && response.data.success) {
                    setUser(response.data.data);
                    localStorage.setItem('authUser', JSON.stringify(response.data.data));
                } else {
                    // If getMe fails, token might be invalid, so log out
                    logout();
                }
            } catch (err) {
                console.error("Error refreshing user:", err);
                logout(); // Logout on error
            } finally {
                setLoading(false);
            }
        }
    }, [token, logout]);


    const value = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        refreshUser, // Expose refreshUser
        setError // Allow components to clear errors
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
