import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * Componente para proteger rutas exclusivas para empresas
 * Redirige a voluntarios a su dashboard correspondiente
 */
const CompanyRoute = ({ children }) => {
  const { isCompany, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo redirigir después de que se haya cargado el estado de autenticación
    if (!loading) {
      if (!isCompany() && isAuthenticated()) {
        // Si es un voluntario, redirigir a la página de dashboard de voluntarios
        navigate('/dashboard', { replace: true });
      } else if (!isAuthenticated()) {
        // Si no está autenticado, redirigir al login
        navigate('/auth/login', { replace: true });
      }
    }
  }, [isCompany, isAuthenticated, loading, navigate]);

  // Mientras se verifica la autenticación, mostrar un spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Solo mostrar el contenido si es una empresa autenticada
  return (isCompany() && isAuthenticated()) ? children : null;
};

export default CompanyRoute;
