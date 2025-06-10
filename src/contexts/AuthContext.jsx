import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    // Check for a valid user in localStorage
    const storedUser = localStorage.getItem("email");
    if (storedUser) {
      setAuthUser({ email: storedUser });  // Store the email or user data
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    setAuthUser(null);
  };

  const login = (userData) => {
    localStorage.setItem("email", userData.email);
    localStorage.setItem("id", userData.id);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userRole", userData.userRole);
    setAuthUser({ email: userData.email });  // Save user info in state
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
