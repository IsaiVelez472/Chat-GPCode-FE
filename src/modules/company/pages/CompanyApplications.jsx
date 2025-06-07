import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import useFetch from "../../core/hooks/useFetch";
import AlertDialog from "../../core/design-system/AlertDialog";

const CompanyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { get, put } = useFetch();

  // Función para cargar las postulaciones de la empresa
  const fetchApplications = async () => {
    if (user && user.id) {
      setLoading(true);
      setError(null);
      try {
        const data = await get(
          `http://127.0.0.1:3000/applications/company/${user.id}`
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

  // Cargar las postulaciones de la empresa al montar el componente
  useEffect(() => {
    fetchApplications();
  }, [user]);

  // Función para aceptar o rechazar una postulación
  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      // Confirmar antes de cambiar el estado
      const action = newStatus === 'approved' ? 'aceptar' : 'rechazar';
      const result = await AlertDialog.confirm({
        title: `${newStatus === 'approved' ? 'Aceptar' : 'Rechazar'} postulación`,
        message: `¿Estás seguro que deseas ${action} esta postulación? Esta acción no se puede deshacer.`,
        confirmButtonText: `Sí, ${action}`,
        cancelButtonText: "Cancelar",
      });

      // Si el usuario confirma la actualización
      if (result.isConfirmed) {
        // Variable para rastrear si el diálogo de carga está abierto
        let loadingDialogOpen = false;

        try {
          // Mostrar diálogo de carga
          AlertDialog.loading({
            title: `${newStatus === 'approved' ? 'Aceptando' : 'Rechazando'} postulación`,
            message: "Espera un momento por favor...",
          });

          loadingDialogOpen = true;

          // Actualizar el estado de la postulación usando la API
          await put(`http://127.0.0.1:3000/applications/${applicationId}`, {
            application: {
              status: newStatus
            }
          });

          // Cerrar diálogo de carga
          if (loadingDialogOpen) {
            AlertDialog.close();
            loadingDialogOpen = false;
          }

          // Mostrar mensaje de éxito
          await AlertDialog.success({
            title: "Postulación actualizada",
            message: `La postulación ha sido ${newStatus === 'approved' ? 'aceptada' : 'rechazada'} con éxito.`,
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
          let errorMessage = `No se pudo ${action} la postulación. Por favor intenta nuevamente.`;

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
            title: `Error al ${action} postulación`,
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
      console.error(`Error al ${newStatus === 'approved' ? 'aceptar' : 'rechazar'} postulación:`, error);
      AlertDialog.error({
        title: "Error",
        message: `No se pudo procesar la postulación. Intenta de nuevo más tarde.`,
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
    fetchApplications();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Postulaciones Recibidas</h1>
        <p className="mt-2 text-gray-600">
          Aquí puedes ver todas las postulaciones de usuarios a tus vacantes.
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
            No hay postulaciones
          </h3>
          <p className="text-gray-600 mb-6">
            Aún no has recibido postulaciones para tus vacantes publicadas.
          </p>
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
                    Candidato
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Documento
                  </th>
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
                        {application.user.first_name} {application.user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.user.document_type} {application.user.document_number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.vacancy?.title || "Vacante no disponible"}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {application.vacancy?.description || "Sin descripción"}
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
                      <div className="flex space-x-2">
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(application.id, "approved")}
                              className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md border border-green-200 hover:bg-green-100 transition-colors"
                              title="Aceptar postulación"
                            >
                              <FaCheck className="mr-1.5" /> Aceptar
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(application.id, "rejected")}
                              className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-md border border-red-200 hover:bg-red-100 transition-colors"
                              title="Rechazar postulación"
                            >
                              <FaTimes className="mr-1.5" /> Rechazar
                            </button>
                          </>
                        )}
                        {application.status !== "pending" && (
                          <span className="text-gray-400 italic">Procesada</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApplications;
