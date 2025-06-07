import { useState, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Hook personalizado para realizar peticiones fetch con manejo de estados y errores
 * @returns {Object} Objeto con métodos y estados para realizar peticiones
 */
const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Realiza una petición GET
   * @param {string} url - URL a la que hacer la petición
   * @param {Object} options - Opciones adicionales para fetch
   * @returns {Promise<any>} - Promesa que resuelve con los datos o rechaza con error
   */
  const get = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message || "Error al realizar la petición");
      console.error("Error en petición fetch:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Realiza una petición POST
   * @param {string} url - URL a la que hacer la petición
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales para fetch
   * @returns {Promise<any>} - Promesa que resuelve con los datos o rechaza con error
   */
  const post = useCallback(async (url, body, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });

      // Primero obtenemos los datos de la respuesta, incluso si hay error
      const responseData = await response.json();
      if (!response.ok || responseData.errors) {
        // Crear un objeto de error con la estructura completa de la respuesta
        const errorObj = new Error(
          `Error HTTP ${response.status}: ${response.statusText}`
        );
        errorObj.status = response.status;
        errorObj.statusText = response.statusText;
        errorObj.response = responseData;
        throw errorObj;
      }

      setData(responseData);
      return responseData;
    } catch (err) {
      // Si es un error que ya tiene la estructura que esperamos (con response)
      if (err.response) {
        setError(err.message);
        console.error("Error en petición fetch:", err);
        throw err;
      }
      // En caso de errores de red u otros errores sin estructura
      else {
        setError(err.message || "Error al realizar la petición");
        console.error("Error en petición fetch:", err);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Realiza una petición PUT
   * @param {string} url - URL a la que hacer la petición
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales para fetch
   * @returns {Promise<any>} - Promesa que resuelve con los datos o rechaza con error
   */
  const put = useCallback(async (url, body, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });

      if (!response.ok) {
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message || "Error al realizar la petición");
      console.error("Error en petición fetch:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Realiza una petición DELETE
   * @param {string} url - URL a la que hacer la petición
   * @param {Object} options - Opciones adicionales para fetch
   * @returns {Promise<any>} - Promesa que resuelve con los datos o rechaza con error
   */
  const del = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Algunos endpoints DELETE no devuelven contenido
      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = { success: true };
      }

      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message || "Error al realizar la petición");
      console.error("Error en petición fetch:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    del,
  };
};

export default useFetch;
