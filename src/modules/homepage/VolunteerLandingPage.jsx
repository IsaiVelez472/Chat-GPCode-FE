import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHandsHelping,
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaRegLightbulb,
  FaRegHandshake,
  FaUserPlus,
  FaBuilding,
  FaSearch,
  FaClipboardCheck,
  FaUserCheck,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import Input from "../core/design-system/Input";
import useFetch from "../core/hooks/useFetch";

function VolunteerLandingPage() {
  const [featuredVacancies, setFeaturedVacancies] = useState([]);
  const [loadingVacancies, setLoadingVacancies] = useState(true);
  const { get } = useFetch();

  useEffect(() => {
    const fetchFeaturedVacancies = async () => {
      try {
        setLoadingVacancies(true);
        const response = await get("http://127.0.0.1:3000/vacantes");
        if (response && Array.isArray(response)) {
          setFeaturedVacancies(response.slice(0, 3));
        }
      } catch (error) {
        console.error("Error al cargar vacantes destacadas:", error);
      } finally {
        setLoadingVacancies(false);
      }
    };

    fetchFeaturedVacancies();
  }, [get]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-400 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Conectamos Voluntarios con Oportunidades
              </h1>
              <p className="text-xl mb-8">
                VoluntApp es la plataforma que une a empresas y organizaciones
                con personas dispuestas a donar su tiempo y habilidades para
                causas importantes.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/auth/volunteer-registration"
                  className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-gray-100 transition-colors text-center"
                >
                  Registrarme como Voluntario
                </Link>
                <Link
                  to="/auth/company-registration"
                  className="px-6 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-primary-600 transition-colors text-center"
                >
                  Registrar mi Empresa
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Voluntarios trabajando juntos"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para Quién es VoluntApp */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Para quién es VoluntApp?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma está diseñada para conectar a quienes necesitan
              ayuda con quienes desean ofrecerla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-primary-50 p-8 rounded-lg border border-primary-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <FaBuilding className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Para Empresas y Organizaciones
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaRegLightbulb className="text-primary-500 mt-1 mr-3" />
                  <p className="text-gray-700">
                    Publica oportunidades de voluntariado para tus proyectos e
                    iniciativas
                  </p>
                </li>
                <li className="flex items-start">
                  <FaUsers className="text-primary-500 mt-1 mr-3" />
                  <p className="text-gray-700">
                    Encuentra personas con las habilidades específicas que
                    necesitas
                  </p>
                </li>
                <li className="flex items-start">
                  <FaChartLine className="text-primary-500 mt-1 mr-3" />
                  <p className="text-gray-700">
                    Gestiona aplicaciones y coordina con los voluntarios de
                    manera eficiente
                  </p>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/auth/company-registration"
                  className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
                >
                  Registrar mi Organización
                </Link>
              </div>
            </div>

            <div className="bg-primary-50 p-8 rounded-lg border border-primary-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <FaUserPlus className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Para Voluntarios
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaSearch className="text-primary-500 mt-1 mr-3" />
                  <p className="text-gray-700">
                    Encuentra oportunidades que se ajusten a tus intereses y
                    disponibilidad
                  </p>
                </li>
                <li className="flex items-start">
                  <FaBriefcase className="text-primary-500 mt-1 mr-3" />
                  <p className="text-gray-700">
                    Desarrolla nuevas habilidades y gana experiencia valiosa
                  </p>
                </li>
                <li className="flex items-start">
                  <FaHandsHelping className="text-primary-500 mt-1 mr-3" />
                  <p className="text-gray-700">
                    Contribuye a causas importantes y genera un impacto positivo
                    en la sociedad
                  </p>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/auth/volunteer-registration"
                  className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
                >
                  Registrarme como Voluntario
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section
        id="how-it-works"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cómo Funciona VoluntApp
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un proceso simple para conectar voluntarios con oportunidades
              significativas
            </p>
          </div>

          <div className="relative">
            {/* Línea conectora en desktop */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-primary-200 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Para Empresas */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBuilding className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                  1. Registro
                </h3>
                <p className="text-gray-600 text-center">
                  Las empresas y organizaciones crean su perfil detallando su
                  misión y necesidades.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaRegHandshake className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                  2. Publicación
                </h3>
                <p className="text-gray-600 text-center">
                  Publican oportunidades de voluntariado especificando
                  habilidades requeridas y duración.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClipboardCheck className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                  3. Selección
                </h3>
                <p className="text-gray-600 text-center">
                  Revisan aplicaciones y seleccionan a los voluntarios más
                  adecuados para cada proyecto.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserCheck className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                  4. Colaboración
                </h3>
                <p className="text-gray-600 text-center">
                  Coordinan con los voluntarios seleccionados para llevar a cabo
                  el proyecto con éxito.
                </p>
              </div>
            </div>

            {/* Para Voluntarios */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Para Voluntarios
              </h3>
            </div>

            {/* Línea conectora en desktop */}
            <div className="hidden md:block absolute top-[24rem] left-0 right-0 h-1 bg-primary-200 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserPlus className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                  1. Registro
                </h3>
                <p className="text-gray-600 text-center">
                  Crea tu perfil destacando tus habilidades, intereses y
                  disponibilidad.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                  2. Exploración
                </h3>
                <p className="text-gray-600 text-center">
                  Explora oportunidades que se ajusten a tus intereses y
                  disponibilidad.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClipboardCheck className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                  3. Postulación
                </h3>
                <p className="text-gray-600 text-center">
                  Postúlate a las oportunidades que más te interesen con un solo
                  clic.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHandsHelping className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                  4. Participación
                </h3>
                <p className="text-gray-600 text-center">
                  Participa en proyectos significativos y haz un impacto
                  positivo en la sociedad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oportunidades Destacadas */}
      <section
        id="opportunities"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Oportunidades Destacadas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explora algunas de las oportunidades de voluntariado disponibles
              en nuestra plataforma
            </p>
          </div>

          {loadingVacancies ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : featuredVacancies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredVacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={
                        vacancy.image ||
                        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={vacancy.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {vacancy.tags &&
                        vacancy.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
                      {vacancy.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {vacancy.description}
                    </p>
                    <div className="flex flex-col gap-2 mb-4">
                      {vacancy.project && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaBuilding className="mr-2 text-primary-500" />
                          <span>{vacancy.project.name}</span>
                        </div>
                      )}
                      {vacancy.project && vacancy.project.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="mr-2 text-primary-500" />
                          <span>{vacancy.project.location}</span>
                        </div>
                      )}
                      {vacancy.expiration_date && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarAlt className="mr-2 text-primary-500" />
                          <span>
                            Expira:{" "}
                            {new Date(
                              vacancy.expiration_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-primary-700">
                        {vacancy.vacancies_count || 0}{" "}
                        {(vacancy.vacancies_count || 0) === 1
                          ? "vacante"
                          : "vacantes"}
                      </span>
                      <Link
                        to="/auth/login"
                        className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No hay oportunidades disponibles en este momento.
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/auth/login"
              className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-colors"
            >
              Ver Todas las Oportunidades
            </Link>
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Tienes Preguntas?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Estamos aquí para ayudarte a encontrar la oportunidad perfecta o
              los voluntarios ideales para tu proyecto.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    id="name"
                    name="name"
                    label="Nombre"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Correo Electrónico"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <Input
                  id="subject"
                  name="subject"
                  label="Asunto"
                  placeholder="Asunto de tu mensaje"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-colors"
                >
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VolunteerLandingPage;
