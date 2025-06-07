import { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Custom hook for company registration
 * @returns {Object} - Registration functions and state
 */
export const useCompanyRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const registerCompany = async (data) => {
    setLoading(true);

    try {
      // Si ya tenemos los datos de la API, no necesitamos hacer otra llamada
      if (data.userType === "empresa") {
        // Crear objeto de usuario y establecerlo en el estado
        const userData = {
          id: data.id || data.empresa?.id || "1",
          first_name: data.empresa?.nombre_contacto || data.nombre_contacto || "",
          last_name: data.empresa?.apellido_contacto || data.apellido_contacto || "",
          email: data.empresa?.correo || data.correo || "",
          company_name: data.empresa?.nombre || data.nombre || "",
          nit: data.empresa?.nit || data.nit || "",
          type: "company",
          userType: "empresa",
          token: data.token || "",
        };

        // Guardar en el contexto
        setUser(userData);
        setLoading(false);
        return { success: true, user: userData };
      }

      setLoading(false);
      return {
        success: false,
        error: "Datos de empresa inválidos",
      };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.message || "Error al registrar la empresa",
      };
    }
  };

  return {
    registerCompany,
    loading,
  };
};

export default useCompanyRegistration;
