import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Button from "../../core/design-system/Button";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/context/AuthContext";
import AlertDialog from "../../core/design-system/AlertDialog";
import useFetch from "../../core/hooks/useFetch";

const CompanyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { get, del } = useFetch();

  // Obtener el ID de la empresa del usuario autenticado
  const companyId = user?.id || 1; // Fallback a 1 si no hay ID

  useEffect(() => {
    // Solo hacer la llamada a la API si tenemos un companyId válido
    if (!companyId) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await get(`http://127.0.0.1:3000/proyectos/empresa/${companyId}`);

        // Transformar los datos para adaptarlos al formato esperado por la UI
        const formattedProjects = data.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          status: determineStatus(project), // Función para determinar el estado basado en fechas
          vacanciesCount: project.vacanciesCount || 0, // Valor por defecto si no existe
          tags: project.tags,
          location: project.location,
          startDate: project.startDate || project.created_at,
          endDate: project.endDate || project.updated_at,
          created_at: project.created_at,
          updated_at: project.updated_at,
        }));

        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("No se pudieron cargar los proyectos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [companyId, get]); // Añadir companyId y get como dependencias

  // Función para determinar el estado del proyecto
  // Función para eliminar un proyecto
  const handleDeleteProject = async (projectId) => {
    // Usar AlertDialog para confirmar la eliminación
    const result = await AlertDialog.confirm({
      title: '¿Eliminar proyecto?',
      message: '¿Estás seguro de que deseas eliminar este proyecto? Esta acción también eliminará todas las vacantes asociadas y no se puede deshacer.',
      icon: 'warning',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      try {
        AlertDialog.loading({
          title: 'Eliminando...',
          message: 'Procesando tu solicitud'
        });
        
        await del(`http://127.0.0.1:3000/proyectos/${projectId}`);

        // Actualizar la lista eliminando el proyecto
        setProjects(projects.filter((project) => project.id !== projectId));
        
        AlertDialog.success({
          title: '¡Eliminado!',
          message: 'El proyecto ha sido eliminado correctamente.'
        });
      } catch (error) {
        console.error("Error deleting project:", error);
        
        AlertDialog.error({
          title: 'Error',
          message: 'No se pudo eliminar el proyecto. Intente nuevamente.'
        });
      }
    }
  };

  const determineStatus = (project) => {
    // Aquí puedes implementar la lógica para determinar el estado
    // Por ahora, asignamos un estado aleatorio como ejemplo
    const statuses = ["En progreso", "Completado", "Planificación"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Función para obtener la clase de badge según el estado
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "En progreso":
        return "bg-blue-100 text-blue-800";
      case "Completado":
        return "bg-green-100 text-green-800";
      case "Planificación":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para formatear fechas con nombre del mes
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
          <p className="mt-2 text-gray-600">
            Gestiona los proyectos de voluntariado de tu organización
          </p>
        </div>
        <Link to="/company/projects/create">
          <Button variant="primary" className="flex items-center">
            <FaPlus className="mr-2" /> Nuevo Proyecto
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No tienes proyectos
          </h3>
          <p className="text-gray-600 mb-6">
            Aún no has creado ningún proyecto de voluntariado.
          </p>
          <Link
            to="/company/projects/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
          >
            <FaPlus className="mr-2" /> Crear primer proyecto
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mx-auto max-w-7xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Proyecto
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Etiquetas
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vacantes
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {project.title}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.vacanciesCount}{" "}
                      {project.vacanciesCount === 1 ? "vacante" : "vacantes"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex justify-center space-x-3">
                        <Link
                          to={`/company/projects/${project.id}/edit`}
                          className="text-primary-500 hover:text-primary-700 transition-colors"
                          title="Editar proyecto"
                        >
                          <div className="p-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors">
                            <FaEdit className="h-4 w-4" />
                          </div>
                        </Link>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteProject(project.id);
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
    </div>
  );
};

export default CompanyProjects;
