import { useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../api/authApi.js";
import { getToken, removeToken, saveToken } from "../utils/tokenStorage.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Restores a saved login session by validating the stored token with the backend.
  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(token);
        setUser(response.data);
      } catch {
        removeToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  async function register(userDetails) {
    return registerUser(userDetails);
  }

  async function login(credentials) {
    const loginResponse = await loginUser(credentials);
    const authToken = loginResponse.data.token;

    saveToken(authToken);
    setToken(authToken);

    const currentUserResponse = await getCurrentUser(authToken);
    setUser(currentUserResponse.data);

    return currentUserResponse;
  }

  function logout() {
    removeToken();
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isAuthLoading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
