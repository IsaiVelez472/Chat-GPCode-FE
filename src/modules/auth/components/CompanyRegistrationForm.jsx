import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../../core/design-system/Input";
import Select from "../../core/design-system/Select";
import TextArea from "../../core/design-system/TextArea";
import Button from "../../core/design-system/Button";
import { useCompanyRegistration } from "../hooks/useCompanyRegistration";
import { toast } from 'react-toastify';

const CompanyRegistrationForm = () => {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { registerCompany } = useCompanyRegistration();
  const navigate = useNavigate();
  
  const { 
    control, 
    handleSubmit: handleFormSubmit, 
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      companyName: "",
      industry: "",
      companySize: "small",
      nit: "",
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      contactPhone: "",
      password: "",
      confirmPassword: "",
      description: "",
    }
  });

  const password = watch("password");

  const industryOptions = [
    "Tecnología",
    "Salud",
    "Educación",
    "Finanzas",
    "Manufactura",
    "Ventas Minoristas",
    "Alimentación",
    "Turismo",
    "Construcción",
    "Transporte",
    "Medios de Comunicación",
    "Energía",
    "Agricultura",
    "Servicios Profesionales",
    "Otro",
  ];

  const companySizeOptions = [
    { value: "small", label: "Pequeña (1-50 empleados)" },
    { value: "medium", label: "Mediana (51-250 empleados)" },
    { value: "large", label: "Grande (251-1000 empleados)" },
    { value: "enterprise", label: "Empresa (1000+ empleados)" },
  ];

  const onSubmit = async (formData) => {
    setError("");
    setLoading(true);

    try {
      // Preparar los datos para el registro en el formato requerido por la API
      const registrationData = {
        empresa: {
          nombre: formData.companyName,
          industria: formData.industry,
          tamano: formData.companySize === "small" 
            ? "Pequeña (1-50 empleados)" 
            : formData.companySize === "medium" 
              ? "Mediana (51-250 empleados)" 
              : formData.companySize === "large" 
                ? "Grande (251-1000 empleados)" 
                : "Empresa (1000+ empleados)",
          descripcion: formData.description,
          nombre_contacto: formData.contactFirstName,
          apellido_contacto: formData.contactLastName,
          correo: formData.contactEmail,
          telefono: formData.contactPhone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          nit: formData.nit
        }
      };

      // Realizar la petición al endpoint
      const response = await fetch("http://localhost:3000/empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores específicos de la API
        const errorMessage = data.error || 
                            (data.errors && Object.values(data.errors).flat().join(", ")) || 
                            "Error al registrar la empresa. Por favor intenta nuevamente.";
        throw new Error(errorMessage);
      }

      // Guardar datos del usuario en el contexto y redirigir
      data.userType = "empresa"; // Agregar tipo de usuario
      const result = await registerCompany(data);

      if (result.success) {
        toast.success("Empresa registrada exitosamente");
        navigate("/dashboard");
      } else {
        throw new Error(result.error || "Error al registrar la empresa. Por favor intenta nuevamente.");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Registro de Empresa</h3>
        <p className="text-gray-600 mt-2">
          Crea una cuenta para ofrecer oportunidades de voluntariado
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Controller
            name="companyName"
            control={control}
            rules={{ required: "El nombre de la empresa es obligatorio" }}
            render={({ field }) => (
              <Input
                id="companyName"
                label="Nombre de la Empresa"
                error={errors.companyName?.message}
                required
                {...field}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="industry"
              control={control}
              rules={{ required: "La industria es obligatoria" }}
              render={({ field }) => (
                <Select
                  id="industry"
                  label="Industria"
                  options={industryOptions.map((industry) => ({
                    value: industry,
                    label: industry,
                  }))}
                  error={errors.industry?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="companySize"
              control={control}
              render={({ field }) => (
                <Select
                  id="companySize"
                  label="Tamaño de la Empresa"
                  options={companySizeOptions}
                  {...field}
                />
              )}
            />
          </div>

          <Controller
            name="nit"
            control={control}
            rules={{ required: "El NIT es obligatorio" }}
            render={({ field }) => (
              <Input
                id="nit"
                label="NIT"
                type="text"
                placeholder="900.123.456-7"
                error={errors.nit?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                id="description"
                label="Descripción de la Empresa"
                rows={3}
                placeholder="Cuéntanos sobre tu empresa y su misión..."
                {...field}
              />
            )}
          />
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Información de Contacto
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="contactFirstName"
              control={control}
              rules={{ required: "El nombre del contacto es obligatorio" }}
              render={({ field }) => (
                <Input
                  id="contactFirstName"
                  label="Nombre del Contacto"
                  error={errors.contactFirstName?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="contactLastName"
              control={control}
              rules={{ required: "El apellido del contacto es obligatorio" }}
              render={({ field }) => (
                <Input
                  id="contactLastName"
                  label="Apellido del Contacto"
                  error={errors.contactLastName?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="contactEmail"
              control={control}
              rules={{ 
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido"
                }
              }}
              render={({ field }) => (
                <Input
                  id="contactEmail"
                  type="email"
                  label="Correo Electrónico"
                  error={errors.contactEmail?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="contactPhone"
              control={control}
              render={({ field }) => (
                <Input
                  id="contactPhone"
                  type="tel"
                  label="Teléfono"
                  {...field}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="password"
              control={control}
              rules={{ 
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres"
                }
              }}
              render={({ field }) => (
                <Input
                  id="password"
                  type="password"
                  label="Contraseña"
                  error={errors.password?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{ 
                required: "Confirmar la contraseña es obligatorio",
                validate: value => value === password || "Las contraseñas no coinciden"
              }}
              render={({ field }) => (
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirmar Contraseña"
                  error={errors.confirmPassword?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3 text-base"
          >
            {loading ? "Registrando..." : "Registrar Empresa"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary-500 hover:text-primary-600"
          >
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CompanyRegistrationForm;
