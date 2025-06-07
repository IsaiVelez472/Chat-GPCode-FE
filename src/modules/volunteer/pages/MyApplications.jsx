import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCommentDots,
  FaTrashAlt,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import useFetch from "../../core/hooks/useFetch";
import ChatWindow from "../components/ChatWindow";
import { Link } from "react-router-dom";
import AlertDialog from "../../core/design-system/AlertDialog";

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const { get, del } = useFetch();

  // Función para cargar las postulaciones del usuario
  const fetchApplications = async () => {
    if (user && user.id) {
      setLoading(true);
      setError(null);
      try {
        const data = await get(
          `http://127.0.0.1:3000/applications/user/${user.id}`
        );
        setApplications(data);
      } catch (err) {
        setError(err.message || "Error al cargar las postulaciones");
        console.error("Error al cargar postulaciones:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Cargar las postulaciones del usuario al montar el componente
  useEffect(() => {
    fetchApplications();
  }, [user]);

  // Función para eliminar una postulación
  const handleDeleteApplication = async (applicationId) => {
    try {
      // Confirmar antes de eliminar
      const result = await AlertDialog.confirm({
        title: "Eliminar postulación",
        message:
          "¿Estás seguro que deseas eliminar esta postulación? Esta acción no se puede deshacer.",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        // Variable para rastrear si el diálogo de carga está abierto
        let loadingDialogOpen = false;

        try {
          // Mostrar diálogo de carga
          AlertDialog.loading({
            title: "Eliminando postulación",
            message: "Espera un momento por favor...",
          });

          loadingDialogOpen = true;

          // Eliminar la postulación usando la API
          await del(`http://127.0.0.1:3000/applications/${applicationId}`);

          // Cerrar diálogo de carga
          if (loadingDialogOpen) {
            AlertDialog.close();
            loadingDialogOpen = false;
          }

          // Mostrar mensaje de éxito
          await AlertDialog.success({
            title: "Postulación eliminada",
            message: "La postulación ha sido eliminada con éxito.",
          });

          // Recargar las postulaciones
          fetchApplications();
        } catch (apiError) {
          console.log(apiError);

          // Asegurarse de cerrar el diálogo de carga
          if (loadingDialogOpen) {
            AlertDialog.close();
            loadingDialogOpen = false;
          }

          // Extraer mensaje de error del backend
          let errorMessage =
            "No se pudo eliminar la postulación. Por favor intenta nuevamente.";

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
            title: "Error al eliminar postulación",
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
      console.error("Error al eliminar postulación:", error);
      AlertDialog.error({
        title: "Error",
        message:
          "No se pudo eliminar la postulación. Intenta de nuevo más tarde.",
      });
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Función para renderizar el estado con icono
  const renderStatus = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center text-green-600">
            <FaCheckCircle className="mr-1" /> Aprobada
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center text-red-600">
            <FaTimesCircle className="mr-1" /> Rechazada
          </span>
        );
      case "pending":
      default:
        return (
          <span className="flex items-center text-yellow-600">
            <FaHourglassHalf className="mr-1" /> Pendiente
          </span>
        );
    }
  };

  // Función para manejar errores y reintentar la carga
  const handleRetry = async () => {
    if (user && user.id) {
      setLoading(true);
      setError(null);
      try {
        const data = await get(
          `http://127.0.0.1:3000/applications/user/${user.id}`
        );
        setApplications(data);
      } catch (err) {
        setError(err.message || "Error al cargar las postulaciones");
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para abrir un nuevo chat
  const handleOpenChat = (application) => {
    // Verificar si el chat ya está abierto
    const chatExists = activeChats.find(
      (chat) => chat.vacancyId === application.vacancy_id
    );

    if (!chatExists) {
      console.log("Application data:", application); // Para debug

      // Obtenemos el nombre de la empresa o usamos un valor por defecto
      let companyName = "Empresa";
      if (application.vacancy && application.vacancy.empresa) {
        companyName = application.vacancy.empresa.nombre || "Empresa";
      }

      setActiveChats((prev) => [
        ...prev,
        {
          vacancyId: application.vacancy_id,
          companyName: companyName,
          vacancyTitle: application.vacancy?.title || "Vacante",
        },
      ]);
    }
  };

  // Función para cerrar un chat
  const handleCloseChat = (vacancyId) => {
    setActiveChats((prev) =>
      prev.filter((chat) => chat.vacancyId !== vacancyId)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Postulaciones</h1>
        <p className="mt-2 text-gray-600">
          Aquí puedes ver el estado de todas tus postulaciones a oportunidades
          de voluntariado.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-red-600 mb-2">
            Error al cargar las postulaciones
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
          >
            Reintentar
          </button>
        </div>
      ) : !applications || applications.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No tienes postulaciones
          </h3>
          <p className="text-gray-600 mb-6">
            Aún no te has postulado a ninguna oportunidad de voluntariado.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
          >
            Explorar oportunidades
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vacante
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Descripción
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha de Expiración
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha de Postulación
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.vacancy?.title || "Vacante no disponible"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {application.vacancy?.description || "Sin descripción"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {application.vacancy?.expiration_date
                          ? formatDate(application.vacancy.expiration_date)
                          : "No definida"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(application.application_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {renderStatus(application.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleOpenChat(application)}
                          className="text-primary-500 hover:text-primary-700 flex items-center bg-primary-50 hover:bg-primary-100 transition-colors"
                          title="Chatear"
                        >
                          <FaCommentDots className="mr-1" /> Chatear
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteApplication(application.id);
                          }}
                          className="p-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer"
                          title="Eliminar proyecto"
                        >
                          <FaTrash className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Contenedor de chats */}
      <div className="fixed bottom-0 right-0 flex flex-row-reverse items-end space-x-6 space-x-reverse p-5 z-50">
        {activeChats.map((chat) => (
          <ChatWindow
            key={chat.vacancyId}
            vacancyId={chat.vacancyId}
            companyName={chat.companyName}
            vacancyTitle={chat.vacancyTitle}
            onClose={handleCloseChat}
          />
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
