import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../design-system/Button";
import { useAuth } from "../../auth/context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isCompany } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginClick = () => {
    navigate("/auth/login");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  // Obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user) return "U";

    const firstName = user.first_name || "";
    const lastName = user.last_name || "";

    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Obtener el nombre de la empresa
  const getCompanyName = () => {
    if (!user || !user.nombre) return "";

    return user.nombre;
  };

  // Usamos la función isCompany del AuthContext

  // Determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-500">
              VoluntApp
            </Link>
          </div>

          {user ? (
            <>
              <div className="hidden md:flex space-x-8 items-center">
                {isCompany() ? (
                  <>
                    <Link
                      to="/company/vacancies"
                      className={`text-gray-700 hover:text-primary-500 transition-colors ${
                        isActive("/company/vacancies")
                          ? "font-semibold text-primary-500"
                          : ""
                      }`}
                    >
                      Mis Vacantes
                    </Link>
                    <Link
                      to="/company/projects"
                      className={`text-gray-700 hover:text-primary-500 transition-colors ${
                        isActive("/company/projects")
                          ? "font-semibold text-primary-500"
                          : ""
                      }`}
                    >
                      Mis Proyectos
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className={`text-gray-700 hover:text-primary-500 transition-colors ${
                        isActive("/dashboard")
                          ? "font-semibold text-primary-500"
                          : ""
                      }`}
                    >
                      Oportunidades
                    </Link>
                    <Link
                      to="/my-applications"
                      className={`text-gray-700 hover:text-primary-500 transition-colors ${
                        isActive("/my-applications")
                          ? "font-semibold text-primary-500"
                          : ""
                      }`}
                    >
                      Mis Postulaciones
                    </Link>
                  </>
                )}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                {isCompany() ? (
                  <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full border border-primary-200 flex items-center">
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {getCompanyName()}
                    </span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogoutClick}
                >
                  Cerrar Sesión
                </Button>
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-700 hover:text-primary-500 focus:outline-none"
                >
                  {mobileMenuOpen ? (
                    <FaTimes className="h-6 w-6" />
                  ) : (
                    <FaBars className="h-6 w-6" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex space-x-8 items-center">
                <a
                  href="#opportunities"
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Oportunidades
                </a>
                <a
                  href="#benefits"
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Beneficios
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Cómo Funciona
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Contacto
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="primary" size="sm" onClick={handleLoginClick}>
                  Iniciar Sesión
                </Button>
                <div className="md:hidden flex items-center">
                  <button
                    onClick={toggleMobileMenu}
                    className="text-gray-700 hover:text-primary-500 focus:outline-none"
                  >
                    {mobileMenuOpen ? (
                      <FaTimes className="h-6 w-6" />
                    ) : (
                      <FaBars className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                {isCompany() ? (
                  <>
                    <Link
                      to="/company/vacancies"
                      className={`block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors ${
                        isActive("/company/vacancies")
                          ? "font-semibold text-primary-500"
                          : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mis Vacantes
                    </Link>
                    <Link
                      to="/company/projects"
                      className={`block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors ${
                        isActive("/company/projects")
                          ? "font-semibold text-primary-500"
                          : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mis Proyectos
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className={`block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors ${
                        isActive("/dashboard")
                          ? "font-semibold text-primary-500"
                          : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Oportunidades
                    </Link>
                    <Link
                      to="/my-applications"
                      className={`block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors ${
                        isActive("/my-applications")
                          ? "font-semibold text-primary-500"
                          : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mis Postulaciones
                    </Link>
                  </>
                )}
                {isCompany() && (
                  <div className="px-3 py-2 text-primary-700 bg-primary-50 rounded-md my-2">
                    <span className="text-sm font-medium">
                      {getCompanyName()}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => {
                    handleLogoutClick();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <a
                  href="#opportunities"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Oportunidades
                </a>
                <a
                  href="#benefits"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Beneficios
                </a>
                <a
                  href="#how-it-works"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cómo Funciona
                </a>
                <a
                  href="#contact"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
