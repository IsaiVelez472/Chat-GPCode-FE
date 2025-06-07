import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import { FaUserAlt, FaBuilding } from 'react-icons/fa';

const AuthNavigation = () => {
  return (
    <div className="w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary-500">
          Bienvenido a VoluntApp
        </h2>
        <p className="mt-2 text-gray-600">
          Selecciona una opción para continuar
        </p>
      </div>
      
      <div className="space-y-6">
        <Link to="/auth/login" className="w-full">
          <Button variant="primary" className="w-full flex items-center justify-center py-3 text-base">
            <span>Iniciar Sesión</span>
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Link to="/auth/volunteer-registration" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center py-2.5 text-base">
              <FaUserAlt className="mr-2" />
              <span>Registrarme como Voluntario</span>
            </Button>
          </Link>
          
          <Link to="/auth/company-registration" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center py-2.5 text-base">
              <FaBuilding className="mr-2" />
              <span>Registrarme como Empresa</span>
            </Button>
          </Link>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-sm font-medium text-primary-500 hover:text-primary-600">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthNavigation;
