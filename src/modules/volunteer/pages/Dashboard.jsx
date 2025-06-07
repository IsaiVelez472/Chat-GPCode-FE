import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaHandHoldingHeart,
} from "react-icons/fa";
import AlertDialog from "../../core/design-system/AlertDialog";
import { toast } from "react-toastify";
import useFetch from "../../core/hooks/useFetch";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState([]);
  const { loading, error, get, post } = useFetch();

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const data = await get("http://127.0.0.1:3000/vacantes");
      setVacancies(data);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      toast.error("Error al cargar las vacantes");
      // Intentar cargar vacantes de nuevo después de 3 segundos
      setTimeout(() => {
        fetchVacancies();
      }, 3000);
    }
  };

  const handleApply = async (vacancyId, title) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!user || !user.id) {
        AlertDialog.error({
          title: "Error de autenticación",
          message: "Debes iniciar sesión para postularte.",
        });
        return;
      }

      // Confirmación antes de aplicar
      const result = await AlertDialog.confirm({
        title: "¿Deseas postularte?",
        message: `¿Estás seguro que deseas postularte a "${title}"?`,
        icon: "question",
        confirmText: "Sí, postularme",
        cancelText: "Cancelar",
      });

      // Si el usuario confirma
      if (result.isConfirmed) {
        // Variable para rastrear si necesitamos cerrar el diálogo
        let loadingDialogOpen = false;
        
        try {
          // Mostrar diálogo de carga
          AlertDialog.loading({
            title: "Enviando postulación",
            message: "Espera un momento por favor...",
          });
          
          loadingDialogOpen = true;

          // Enviar la postulación a la API
          await post("http://127.0.0.1:3000/applications", {
            application: {
              user_id: user.id,
              vacancy_id: vacancyId,
            },
          });
          
          // Cerrar diálogo de carga
          if (loadingDialogOpen) {
            AlertDialog.close();
            loadingDialogOpen = false;
          }

          // Mostrar mensaje de éxito
          await AlertDialog.success({
            title: "¡Postulación enviada!",
            message: "Tu postulación ha sido enviada con éxito.",
          });

          // Redirigir al usuario a la página de postulaciones
          navigate("/my-applications");
        } catch (apiError) {
          console.log(apiError);
          
          // Asegurarse de cerrar el diálogo de carga
          if (loadingDialogOpen) {
            AlertDialog.close();
            loadingDialogOpen = false;
          }

          // Extraer el mensaje de error del backend
          let errorMessage =
            "No se pudo enviar tu postulación. Por favor intenta nuevamente.";

          // Intentar extraer el mensaje de error de la estructura esperada
          if (apiError.response && apiError.response.errors) {
            // Si es un array, tomar el primer mensaje
            if (
              Array.isArray(apiError.response.errors) &&
              apiError.response.errors.length > 0
            ) {
              errorMessage = apiError.response.errors[0];
            }
            // Si es un string, usarlo directamente
            else if (typeof apiError.response.errors === "string") {
              errorMessage = apiError.response.errors;
            }
          } else if (apiError.message) {
            errorMessage = apiError.message;
          }

          // Mostrar diálogo de error
          AlertDialog.error({
            title: "Error al enviar postulación",
            message: errorMessage,
          });
        } finally {
          // Asegurarse como última medida de que el diálogo de carga se cierre
          if (loadingDialogOpen) {
            AlertDialog.close();
          }
        }
      }
    } catch (error) {
      console.error("Error applying to vacancy:", error);
      AlertDialog.error({
        title: "Error",
        message:
          "No se pudo enviar tu postulación. Intenta de nuevo más tarde.",
      });
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Oportunidades de Voluntariado
        </h1>
        <p className="mt-2 text-gray-600">
          Descubre y postúlate a vacantes de voluntariado que se ajusten a tus
          intereses
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : vacancies.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No hay vacantes disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            No se encontraron oportunidades de voluntariado en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="h-48 relative overflow-hidden">
                {/* Etiqueta de empresa en la esquina superior */}
                {vacancy.empresa && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 text-sm font-medium z-10 rounded-bl-md shadow-md">
                    {vacancy.empresa.nombre}
                  </div>
                )}
                <img
                  src={
                    vacancy.image ||
                    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                  }
                  alt={vacancy.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 hover:line-clamp-none transition-all duration-300">
                  {vacancy.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm line-clamp-2 hover:line-clamp-3 transition-all duration-300">
                  {vacancy.description}
                </p>

                {/* Project name and location badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {vacancy.proyecto && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm">
                      {vacancy.proyecto.title}
                    </span>
                  )}
                  {vacancy.proyecto?.location && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 shadow-sm">
                      <FaMapMarkerAlt
                        className="text-gray-600 mr-1"
                        size={12}
                      />
                      {vacancy.proyecto.location}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Tags badges */}
                  {Array.isArray(vacancy.tags) &&
                    vacancy.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 shadow-sm hover:bg-primary-200 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-gray-700 text-sm flex items-center">
                    <span className="font-semibold mr-2">
                      Fecha de expiración:
                    </span>
                    <span
                      className={`${
                        vacancy.expiration_date
                          ? "text-primary-700"
                          : "text-gray-500 italic"
                      }`}
                    >
                      {formatDate(vacancy.expiration_date)}
                    </span>
                  </p>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {vacancy.vacancies_count || 0}{" "}
                    {(vacancy.vacancies_count || 0) === 1
                      ? "vacante disponible"
                      : "vacantes disponibles"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(vacancy.id, vacancy.title)}
                      className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-sm font-medium flex items-center"
                    >
                      <FaHandHoldingHeart className="mr-2" size={14} />
                      Postularme
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
