import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../../core/design-system/Button";
import { useAuth } from "../../auth/context/AuthContext";
import { toast } from "react-toastify";
import AlertDialog from "../../core/design-system/AlertDialog";
import useFetch from "../../core/hooks/useFetch";

const CompanyVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isCompany } = useAuth();
  const { get, del } = useFetch();

  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true);
      try {
        let url;

        // Determinar la URL según el tipo de usuario
        if (isCompany()) {
          // Si es una empresa, obtener solo sus vacantes
          url = `http://127.0.0.1:3000/vacantes/empresa/${user.id}`;
        } else {
          // Si es un usuario regular, obtener todas las vacantes
          url = "http://127.0.0.1:3000/vacantes";
        }

        console.log("Fetching vacancies from:", url);
        const data = await get(url);
        console.log("Vacancies loaded:", data);
        setVacancies(data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        toast.error("No se pudieron cargar las vacantes. Intente nuevamente.");
        setVacancies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [user, get]);

  // Función para eliminar vacante
  const handleDeleteVacancy = async (vacancyId) => {
    // Usar AlertDialog para confirmar la eliminación
    const result = await AlertDialog.confirm({
      title: "¿Eliminar vacante?",
      message:
        "¿Estás seguro de que deseas eliminar esta vacante? Esta acción no se puede deshacer.",
      icon: "warning",
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        AlertDialog.loading({
          title: "Eliminando...",
          message: "Procesando tu solicitud",
        });

        await del(`http://127.0.0.1:3000/vacantes/${vacancyId}`);

        // Actualizar la lista eliminando la vacante
        setVacancies(vacancies.filter((vacancy) => vacancy.id !== vacancyId));

        AlertDialog.success({
          title: "¡Eliminada!",
          message: "La vacante ha sido eliminada correctamente.",
        });
      } catch (error) {
        console.error("Error deleting vacancy:", error);

        AlertDialog.error({
          title: "Error",
          message: "No se pudo eliminar la vacante. Intente nuevamente.",
        });
      }
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("es-ES", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Retorna el string original si hay error
    }
  };

  // Función para obtener la clase de badge según el estado
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Activa";
      case "closed":
        return "Cerrada";
      case "draft":
        return "Borrador";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Vacantes</h1>
          <p className="mt-2 text-gray-600">
            Gestiona las oportunidades de voluntariado que ofrece tu
            organización
          </p>
        </div>
        <Link to="/company/vacancies/create">
          <Button variant="primary" className="flex items-center">
            <FaPlus className="mr-2" /> Nueva Vacante
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : vacancies.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No tienes vacantes
          </h3>
          <p className="text-gray-600 mb-6">
            Aún no has creado ninguna oportunidad de voluntariado.
          </p>
          <Link
            to="/company/vacancies/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
          >
            <FaPlus className="mr-2" /> Crear primera vacante
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={
                    vacancy.image ||
                    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                  }
                  alt={vacancy.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 right-0 mt-3 mr-3">
                  <span
                    className={`px-3 py-1 ${getStatusBadgeClass(
                      vacancy.status
                    )} text-xs font-semibold rounded-full shadow-sm`}
                  >
                    {getStatusText(vacancy.status)}
                  </span>
                </div>
              </div>
              <div className="p-6">
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
                      {vacancy.expiration_date
                        ? formatDate(vacancy.expiration_date)
                        : "No especificada"}
                    </span>
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {vacancy.vacancies_count || 0}{" "}
                    {(vacancy.vacancies_count || 0) === 1
                      ? "vacante disponible"
                      : "vacantes disponibles"}
                  </span>
                  <div className="flex gap-2">
                    {isCompany() && (
                      <button
                        onClick={() => handleDeleteVacancy(vacancy.id)}
                        className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        aria-label="Eliminar vacante"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                    <Link
                      to={`/company/vacancies/${vacancy.id}/edit`}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors text-sm font-medium flex items-center"
                    >
                      Editar
                    </Link>
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

export default CompanyVacancies;
