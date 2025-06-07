import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../../core/design-system/Input";
import Button from "../../core/design-system/Button";
import Select from "../../core/design-system/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { es } from "date-fns/locale";
import { useVolunteerRegistration } from "../hooks/useVolunteerRegistration";

const VolunteerRegistrationForm = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { registerVolunteer, loading } = useVolunteerRegistration();
  
  // Calcular la fecha de hace 18 años
  const getDefaultDate = () => {
    const today = new Date();
    return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  };
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    control
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      date_of_birth: getDefaultDate(),
      document_type: "",
      document_number: "",
    }
  });
  
  const password = watch("password");
  
  const onSubmit = async (data) => {
    setError("");
    
    try {
      const result = await registerVolunteer(data);
      
      if (result.success) {
        // Registro exitoso, redirigir al dashboard
        navigate("/dashboard");
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || "Error al registrarse. Por favor intenta nuevamente.");
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Registro de Voluntario
        </h3>
        <p className="text-gray-600 mt-2">
          Únete a nuestra comunidad global de voluntarios
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="first_name"
              label="Nombre"
              {...register("first_name", { 
                required: "El nombre es requerido" 
              })}
              error={errors.first_name?.message}
            />
          </div>

          <div>
            <Input
              id="last_name"
              label="Apellido"
              {...register("last_name", { 
                required: "El apellido es requerido" 
              })}
              error={errors.last_name?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              id="document_type"
              label="Tipo de Documento"
              {...register("document_type", { 
                required: "El tipo de documento es requerido" 
              })}
              error={errors.document_type?.message}
              options={[
                { value: "", label: "Seleccionar..." },
                { value: "CC", label: "Cédula de Ciudadanía" },
                { value: "CE", label: "Cédula de Extranjería" },
                { value: "TI", label: "Tarjeta de Identidad" },
                { value: "PP", label: "Pasaporte" },
              ]}
            />
          </div>

          <div>
            <Input
              id="document_number"
              label="Número de Documento"
              {...register("document_number", { 
                required: "El número de documento es requerido",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números"
                }
              })}
              error={errors.document_number?.message}
            />
          </div>
        </div>

        <div>
          <Input
            id="email"
            type="email"
            label="Correo Electrónico"
            {...register("email", { 
              required: "El correo electrónico es requerido",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Correo electrónico inválido"
              }
            })}
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="password"
              type="password"
              label="Contraseña"
              {...register("password", { 
                required: "La contraseña es requerida",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
                  message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial"
                }
              })}
              error={errors.password?.message}
            />
          </div>

          <div>
            <Input
              id="password_confirmation"
              type="password"
              label="Confirmar Contraseña"
              {...register("password_confirmation", { 
                required: "Confirma tu contraseña",
                validate: value => value === password || "Las contraseñas no coinciden"
              })}
              error={errors.password_confirmation?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="phone"
              type="tel"
              label="Número de Teléfono"
              {...register("phone", { 
                required: "El número de teléfono es requerido",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Ingresa un número de teléfono válido de 10 dígitos"
                }
              })}
              error={errors.phone?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <Controller
              control={control}
              name="date_of_birth"
              rules={{ 
                required: "La fecha de nacimiento es requerida",
                validate: value => {
                  const today = new Date();
                  const birthDate = new Date(value);
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    return (age - 1 >= 18) || "Debes ser mayor de 18 años";
                  }
                  return (age >= 18) || "Debes ser mayor de 18 años";
                }
              }}
              render={({ field }) => (
                <div className="relative">
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    locale={es}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.date_of_birth 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none bg-white text-gray-900 pr-10`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}
            />
            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-red-500">{errors.date_of_birth.message}</p>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3 text-base"
          >
            {loading ? "Registrando..." : "Registrarse como Voluntario"}
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

export default VolunteerRegistrationForm;
