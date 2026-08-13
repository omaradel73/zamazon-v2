import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage AND verify with server
    const initAuth = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
           const parsedUser = JSON.parse(storedUser);
           try {
             // Verify if user data is stale (especially isAdmin)
             const res = await fetch(`/api/users/${parsedUser.id}`); // We need an endpoint to get user by ID or /me
             if (res.ok) {
                const refreshedUser = await res.json();
                setUser(refreshedUser);
                localStorage.setItem('user', JSON.stringify(refreshedUser));
             } else {
                // If fetch fails (e.g. user deleted), keep local or logout? 
                // Creating a simplified /api/auth/me or reusing profile endpoint would be ideal.
                // For now, let's assume if storedUser exists we set it, but we TRY to refresh it.
                setUser(parsedUser); 
             }
           } catch (e) {
             console.log("Could not verify session, using local data");
             setUser(parsedUser);
           }
        }
    };
    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
