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

const CreateProjectForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const { get, post, put } = useFetch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      tags: [],
    },
  });

  // Efecto para cargar los datos del proyecto si estamos en modo edición
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchProjectDetails();
    }
  }, [id]);

  // Función para obtener los detalles del proyecto a editar
  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const projectData = await get(`http://127.0.0.1:3000/proyectos/${id}`);
      setCurrentProject(projectData);

      // Actualizar el formulario con los datos del proyecto
      reset({
        title: projectData.title,
        description: projectData.description,
        location: projectData.location || "",
      });

      // Actualizar tags seleccionados
      if (projectData.tags && Array.isArray(projectData.tags)) {
        setSelectedTags(projectData.tags);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("No se pudieron cargar los detalles del proyecto");
    } finally {
      setLoading(false);
    }
  };

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
  ];

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Añadir las etiquetas seleccionadas a los datos
      data.tags = selectedTags;

      // Crear el objeto de proyecto con la estructura requerida por el backend
      const projectData = {
        proyecto: {
          company_id: user?.id || 1, // Usar el ID del usuario autenticado
          title: data.title,
          description: data.description,
          location: data.location,
          tags: data.tags,
        },
      };

      let url = "http://127.0.0.1:3000/proyectos";
      let successMessage = "Proyecto creado exitosamente";

      // Si estamos en modo edición, cambiar a PUT y ajustar la URL
      if (isEditMode) {
        url = `http://127.0.0.1:3000/proyectos/${id}`;
        successMessage = "Proyecto actualizado exitosamente";
      }

      // Mostrar indicador de carga
      AlertDialog.loading({
        title: isEditMode ? "Actualizando proyecto..." : "Creando proyecto...",
        message: "Por favor espere un momento"
      });

      // Enviar los datos al backend usando el hook useFetch
      const result = isEditMode 
        ? await put(url, projectData)
        : await post(url, projectData);

      console.log(
        isEditMode ? "Proyecto actualizado:" : "Proyecto creado:",
        result
      );

      // Cerrar el diálogo de carga
      AlertDialog.close();

      // Mostrar mensaje de éxito
      AlertDialog.success({
        title: isEditMode ? "¡Actualizado!" : "¡Creado!",
        message: successMessage
      });

      navigate("/company/projects");
    } catch (error) {
      console.error(
        isEditMode ? "Error updating project:" : "Error creating project:",
        error
      );

      AlertDialog.error({
        title: "Error",
        message: isEditMode
          ? "Error al actualizar el proyecto. Por favor intenta nuevamente."
          : "Error al crear el proyecto. Por favor intenta nuevamente."
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
        onClick={() => navigate("/company/projects")}
        className="flex items-center text-gray-600 hover:text-primary-500 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Volver a Proyectos
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEditMode
            ? "Actualiza la información del proyecto de voluntariado"
            : "Completa la información para crear un nuevo proyecto de voluntariado"}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Controller
              name="title"
              control={control}
              rules={{ required: "El título del proyecto es obligatorio" }}
              render={({ field }) => (
                <Input
                  id="title"
                  label="Título del Proyecto"
                  placeholder="Ej. Limpieza de Playa en Cartagena"
                  error={errors.title?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: "La descripción del proyecto es obligatoria" }}
              render={({ field }) => (
                <TextArea
                  id="description"
                  label="Descripción del Proyecto"
                  placeholder="Describe brevemente en qué consiste el proyecto..."
                  rows={4}
                  error={errors.description?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              rules={{ required: "La ubicación es obligatoria" }}
              render={({ field }) => (
                <Input
                  id="location"
                  label="Ubicación"
                  placeholder="Ej. Cartagena, Colombia o Remoto"
                  error={errors.location?.message}
                  required
                  {...field}
                />
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiquetas del Proyecto *
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
                    Selecciona al menos una etiqueta para tu proyecto
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
                {selectedTags.length === 0 && errors.tags && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.tags.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              className="mr-3"
              onClick={() => navigate("/company/projects")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || selectedTags.length === 0}
            >
              {loading ? "Creando..." : "Crear Proyecto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
