import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../../core/design-system/Input";
import Button from "../../core/design-system/Button";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar formulario
      if (!formData.email || !formData.password) {
        throw new Error("Por favor completa todos los campos");
      }

      // Intentar iniciar sesión como voluntario y como empresa en paralelo
      const voluntarioPromise = fetch("http://127.0.0.1:3000/voluntarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voluntario: {
            identifier: formData.email,
            password: formData.password,
          },
        }),
      });

      const empresaPromise = fetch("http://127.0.0.1:3000/empresas/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empresa: {
            identifier: formData.email,
            password: formData.password,
          },
        }),
      });

      // Esperar a que ambas promesas se resuelvan
      const [voluntarioResponse, empresaResponse] = await Promise.allSettled([
        voluntarioPromise,
        empresaPromise,
      ]);

      // Procesar respuesta de voluntario
      if (voluntarioResponse.status === "fulfilled" && voluntarioResponse.value.ok) {
        const data = await voluntarioResponse.value.json();
        data.userType = "voluntario"; // Agregar tipo de usuario
        await login(data);
        navigate("/dashboard");
        return;
      }

      // Si falla el login como voluntario, procesar respuesta de empresa
      if (empresaResponse.status === "fulfilled" && empresaResponse.value.ok) {
        const data = await empresaResponse.value.json();
        data.userType = "empresa"; // Agregar tipo de usuario
        await login(data);
        navigate("/dashboard");
        return;
      }

      // Si ambos fallan, mostrar error
      let errorMessage = "Credenciales incorrectas. Por favor intenta nuevamente.";
      
      if (voluntarioResponse.status === "fulfilled" && !voluntarioResponse.value.ok) {
        const voluntarioData = await voluntarioResponse.value.json();
        errorMessage = voluntarioData.error || errorMessage;
      } else if (empresaResponse.status === "fulfilled" && !empresaResponse.value.ok) {
        const empresaData = await empresaResponse.value.json();
        errorMessage = empresaData.error || errorMessage;
      }
      
      toast.error(errorMessage);
    } catch (err) {
      toast.error(
        err.message || "Error al iniciar sesión. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Iniciar Sesión</h3>
        <p className="text-gray-600 mt-2">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="text"
          label="Correo Electrónico o documento"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com o número de documento"
          required
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <div>
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className={`w-full py-3 text-base ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          ¿No tienes una cuenta? Regístrate como:
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/auth/company-registration" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full py-2.5 text-base"
            >
              Registrarme como Empresa
            </Button>
          </Link>
          <Link to="/auth/volunteer-registration" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full py-2.5 text-base"
            >
              Registrarme como Voluntario
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
