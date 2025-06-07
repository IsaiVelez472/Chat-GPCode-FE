import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import Input from "../../core/design-system/Input";
import TextArea from "../../core/design-system/TextArea";
import Button from "../../core/design-system/Button";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/context/AuthContext";
import useFetch from "../../core/hooks/useFetch";
import AlertDialog from "../../core/design-system/AlertDialog";

const CreateVacancieForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentVacancy, setCurrentVacancy] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const { get, post, put } = useFetch();

  // Obtener el ID de la empresa del usuario autenticado
  const companyId = user?.id || 1; // Fallback a 1 si no hay ID

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      vacanciesCount: 1,
      projectId: "",
      requirements: "",
      responsibilities: "",
      imageUrl: "",
      expirationDate: "",
    },
  });

  // Lista de etiquetas disponibles
  const availableTags = [
    "Tecnología",
    "Educación",
    "Desarrollo Web",
    "Desarrollo Móvil",
    "Salud",
    "Medio Ambiente",
    "Limpieza",
    "Comunitario",
    "Marketing",
    "Emprendimiento",
    "Eventos",
    "Logística",
    "Finanzas",
    "Legal",
    "Diseño",
    "Comunicación",
    "Construcción",
    "Alimentación",
    "Deporte",
    "Arte y Cultura",
    "Enseñanza",
    "Mentoría",
  ];

  // Cargar proyectos al montar el componente y verificar si estamos en modo edición
  useEffect(() => {
    const fetchProjects = async () => {
      if (!companyId) return;

      setLoadingProjects(true);
      try {
        const data = await get(`http://127.0.0.1:3000/proyectos/empresa/${companyId}`);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        AlertDialog.error({
          title: "Error",
          message: "No se pudieron cargar los proyectos. Intente nuevamente."
        });
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
    
    if (id) {
      setIsEditMode(true);
      fetchVacancyDetails();
    }
  }, [id, companyId, get]);

  // Función para obtener los detalles de la vacante a editar
  const fetchVacancyDetails = async () => {
    setLoading(true);
    try {
      const vacancyData = await get(`http://127.0.0.1:3000/vacantes/${id}`);
      setCurrentVacancy(vacancyData);
      
      // Actualizar el formulario con los datos de la vacante
      setValue("title", vacancyData.title);
      setValue("description", vacancyData.description);
      setValue("vacanciesCount", vacancyData.vacancies_count);
      setValue("projectId", vacancyData.project_id?.toString() || "");
      setValue("imageUrl", vacancyData.image || "");
      setValue("expirationDate", vacancyData.expiration_date || "");
      
      // Actualizar tags seleccionados
      if (vacancyData.tags && Array.isArray(vacancyData.tags)) {
        setSelectedTags(vacancyData.tags);
      }
    } catch (error) {
      console.error("Error fetching vacancy details:", error);
      AlertDialog.error({ title: "Error", message: "No se pudieron cargar los detalles de la vacante" });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar proyecto seleccionado cuando cambia
  const watchProjectId = watch("projectId");
  useEffect(() => {
    if (watchProjectId) {
      const project = projects.find(
        (p) => p.id.toString() === watchProjectId.toString()
      );
      setSelectedProject(project);
    } else {
      setSelectedProject(null);
    }
  }, [watchProjectId, projects]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (!companyId) {
        toast.error("No se ha podido identificar la empresa. Por favor inicie sesión nuevamente.");
        setLoading(false);
        return;
      }

      // Añadir las etiquetas seleccionadas a los datos
      data.tags = selectedTags;

      // Crear el objeto de vacante con la estructura requerida por el backend
      const vacancyData = {
        vacante: {
          company_id: companyId,
          project_id: parseInt(data.projectId),
          title: data.title,
          description: data.description,
          vacancies_count: data.vacanciesCount,
          image: data.imageUrl,
          expiration_date: data.expirationDate,
          tags: selectedTags,
        },
      };
      
      console.log("Datos a enviar:", JSON.stringify(vacancyData));

      let url = "http://127.0.0.1:3000/vacantes";
      let successMessage = "Vacante creada exitosamente";

      // Si estamos en modo edición, cambiar a PUT y ajustar la URL
      if (isEditMode) {
        url = `http://127.0.0.1:3000/vacantes/${id}`;
        successMessage = "Vacante actualizada exitosamente";
      }

      // Mostrar indicador de carga
      AlertDialog.loading({
        title: isEditMode ? "Actualizando vacante..." : "Creando vacante...",
        message: "Por favor espere un momento"
      });

      // Enviar los datos al backend usando el hook useFetch
      const result = isEditMode 
        ? await put(url, vacancyData)
        : await post(url, vacancyData);

      console.log(
        isEditMode ? "Vacante actualizada:" : "Vacante creada:",
        result
      );

      // Cerrar el diálogo de carga
      AlertDialog.close();
      
      // Mostrar mensaje de éxito
      AlertDialog.success({
        title: isEditMode ? "¡Actualizada!" : "¡Creada!",
        message: successMessage
      });

      // Redireccionar a la página de vacantes
      navigate("/company/vacancies");
    } catch (error) {
      console.error(isEditMode ? "Error updating vacancy:" : "Error creating vacancy:", error);
      
      // Cerrar el diálogo de carga si está abierto
      AlertDialog.close();
      
      // Mostrar mensaje de error
      AlertDialog.error({
        title: "Error",
        message: isEditMode 
          ? "Error al actualizar la vacante. Por favor intenta nuevamente."
          : "Error al crear la vacante. Por favor intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/company/vacancies")}
        className="flex items-center text-primary-500 hover:text-primary-700 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Volver a Vacantes
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Editar Vacante" : "Crear Nueva Vacante"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEditMode 
            ? "Actualiza la información de esta vacante de voluntariado"
            : "Completa la información para crear una nueva vacante de voluntariado"}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Título y cantidad de vacantes en la misma fila */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "El título de la vacante es obligatorio" }}
                  render={({ field }) => (
                    <Input
                      id="title"
                      label="Título de la Vacante"
                      placeholder="Ej. Desarrollador Web Voluntario"
                      error={errors.title?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="vacanciesCount"
                  control={control}
                  rules={{
                    required: "Obligatorio",
                    min: {
                      value: 1,
                      message: "Mín. 1",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="vacanciesCount"
                      type="number"
                      label="Número de Vacantes"
                      placeholder="Ej. 5"
                      error={errors.vacanciesCount?.message}
                      required
                      min="1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || "")
                      }
                    />
                  )}
                />
              </div>
            </div>

            {/* Descripción de la vacante */}
            <Controller
              name="description"
              control={control}
              rules={{
                required: "La descripción de la vacante es obligatoria",
              }}
              render={({ field }) => (
                <TextArea
                  id="description"
                  label="Descripción de la Vacante"
                  placeholder="Describe detalladamente en qué consiste la vacante..."
                  rows={4}
                  error={errors.description?.message}
                  required
                  {...field}
                />
              )}
            />
            {/* Proyecto asociado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proyecto Asociado *
              </label>
              <Controller
                name="projectId"
                control={control}
                rules={{ required: "Debes seleccionar un proyecto" }}
                render={({ field }) => (
                  <div>
                    <select
                      {...field}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-700 bg-white border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      disabled={loadingProjects}
                    >
                      <option value="">Selecciona un proyecto</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                    {errors.projectId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.projectId.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Información del proyecto seleccionado */}
            {selectedProject && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Información del proyecto seleccionado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Nombre:</p>
                    <p className="font-medium">{selectedProject.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ubicación:</p>
                    <p className="font-medium">
                      {selectedProject.location || "No especificada"}
                    </p>
                  </div>
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div className="col-span-1 md:col-span-2">
                      <p className="text-gray-500">Etiquetas:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProject.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Campo de URL de imagen */}
            <div className="mb-4">
              <Controller
                name="imageUrl"
                control={control}
                rules={{
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                    message: "Ingrese una URL válida",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="imageUrl"
                    label="URL de la imagen (opcional)"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    error={errors.imageUrl?.message}
                    {...field}
                  />
                )}
              />
            </div>
            
            {/* Campo de fecha de expiración */}
            <div className="mb-4">
              <Controller
                name="expirationDate"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) return true; // Opcional
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const selectedDate = new Date(value);
                    return selectedDate >= today || "La fecha debe ser igual o posterior a hoy";
                  }
                }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de expiración (opcional)
                    </label>
                    <input
                      {...field}
                      type="date"
                      className={`w-full px-3 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.expirationDate ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.expirationDate && (
                      <p className="text-sm text-red-500 mt-1">{errors.expirationDate.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Etiquetas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiquetas de la Vacante *
              </label>
              <div className="mb-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                {selectedTags.length === 0 && (
                  <p className="text-sm text-gray-500 mb-2">
                    Selecciona al menos una etiqueta para tu vacante
                  </p>
                )}
                <div className="border border-gray-300 rounded-md p-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Etiquetas disponibles:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleTagSelect(tag)}
                        disabled={selectedTags.includes(tag)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              className="mr-3"
              onClick={() => navigate("/company/vacancies")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || selectedTags.length === 0}
            >
              {loading ? "Creando..." : "Crear Vacante"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVacancieForm;
