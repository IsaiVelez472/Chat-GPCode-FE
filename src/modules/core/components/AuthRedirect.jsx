import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

const AuthRedirect = ({ children }) => {
  const { isCompany, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo redirigir después de que se haya cargado el estado de autenticación
    if (!loading) {
      if (isCompany()) {
        // Si es una empresa, redirigir a la página de vacantes de empresa
        navigate('/company/vacancies', { replace: true });
      } else if (isAuthenticated()) {
        // Si es un usuario normal autenticado, redirigir al dashboard
        navigate('/dashboard', { replace: true });
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

  // Si no está autenticado, mostrar el contenido normal para usuarios no logueados
  return (isAuthenticated() || isCompany()) ? null : children;
};

export default AuthRedirect;
