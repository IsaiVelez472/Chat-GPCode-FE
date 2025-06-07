import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-primary-500 mb-4">VoluntApp</h3>
          <p className="text-sm text-gray-600 max-w-md mb-6">
            Conectando voluntarios apasionados con oportunidades significativas en todo el mundo.
          </p>
          
          {/* Mostrar Enlaces Rápidos solo cuando no hay usuario logueado */}
          {!user && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-4">Enlaces Rápidos</h4>
              <ul className="flex flex-wrap justify-center gap-4 text-sm">
                <li><Link to="/" className="text-gray-600 hover:text-primary-500 transition-colors">Inicio</Link></li>
                <li><Link to="/#opportunities" className="text-gray-600 hover:text-primary-500 transition-colors">Oportunidades</Link></li>
                <li><Link to="/#benefits" className="text-gray-600 hover:text-primary-500 transition-colors">Beneficios</Link></li>
                <li><Link to="/#how-it-works" className="text-gray-600 hover:text-primary-500 transition-colors">Cómo Funciona</Link></li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 mt-4 pt-6 text-center text-sm">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} VoluntApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
