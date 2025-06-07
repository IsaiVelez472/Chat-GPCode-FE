import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("voluntAppUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("voluntAppUser");
      }
    }
    setLoading(false);
  }, []);

  // Guardar usuario en localStorage cuando cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem("voluntAppUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("voluntAppUser");
    }
  }, [user]);

  // Función para iniciar sesión
  const login = async (userData) => {
    setLoading(true);

    try {
      // Guardar el usuario en el estado y localStorage
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.message || "Error al iniciar sesión",
      };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("voluntAppUser");
  };

  // Función para verificar si el usuario es una empresa
  const isCompany = () => {
    return user && (user.type === "company" || user.userType === "empresa");
  };

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    setUser,
    isCompany,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
