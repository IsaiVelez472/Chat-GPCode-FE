import { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Custom hook for volunteer registration
 * @returns {Object} - Registration functions and state
 */
export const useVolunteerRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const registerVolunteer = async (data) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/voluntarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voluntario: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            phone: data.phone,
            date_of_birth:
              data.date_of_birth instanceof Date
                ? data.date_of_birth.toISOString().split("T")[0]
                : data.date_of_birth,
            document_type: data.document_type,
            document_number: data.document_number,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al registrar el voluntario"
        );
      }

      const result = await response.json();

      // Crear objeto de usuario y establecerlo en el estado
      const userData = {
        id: result.id || result.voluntario?.id || "1",
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        type: "volunteer",
      };

      // Guardar en el contexto
      setUser(userData);

      setLoading(false);

      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.message || "Error al registrar el voluntario",
      };
    }
  };

  return {
    registerVolunteer,
    loading,
  };
};

export default useVolunteerRegistration;
