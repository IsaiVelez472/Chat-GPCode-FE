import Swal from 'sweetalert2';

/**
 * AlertDialog - Componente para mostrar diálogos con SweetAlert2
 * @param {object} options - Opciones para configurar el diálogo
 * @returns {Promise} - Promesa que se resuelve cuando se cierra el diálogo
 */
const AlertDialog = {
  /**
   * Muestra un diálogo de confirmación
   * @param {string} title - Título del diálogo
   * @param {string} message - Mensaje del diálogo
   * @param {string} icon - Icono a mostrar (success, error, warning, info, question)
   * @param {string} confirmText - Texto del botón de confirmación
   * @param {string} cancelText - Texto del botón de cancelación
   * @returns {Promise<boolean>} - Promesa que se resuelve con true si se confirmó, false en caso contrario
   */
  confirm: ({
    title = '¿Estás seguro?',
    message = 'Esta acción no se puede deshacer',
    icon = 'warning',
    confirmText = 'Sí, confirmar',
    cancelText = 'Cancelar'
  }) => {
    return Swal.fire({
      title,
      text: message,
      icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      focusCancel: true
    });
  },

  /**
   * Muestra un diálogo de carga
   * @param {string} title - Título del diálogo
   * @param {string} message - Mensaje del diálogo
   * @returns {object} - Objeto Swal para cerrar el diálogo
   */
  loading: ({
    title = 'Procesando...',
    message = 'Por favor espere un momento'
  }) => {
    return Swal.fire({
      title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  /**
   * Muestra un diálogo de resultado
   * @param {string} title - Título del diálogo
   * @param {string} message - Mensaje del diálogo
   * @param {string} icon - Icono a mostrar (success, error, info, warning, question)
   * @returns {Promise} - Promesa que se resuelve cuando se cierra el diálogo
   */
  result: ({
    title,
    message,
    icon
  }) => {
    return Swal.fire({
      title,
      text: message,
      icon,
      confirmButtonColor: '#3085d6'
    });
  },

  /**
   * Muestra un diálogo de éxito
   * @param {string} title - Título del diálogo
   * @param {string} message - Mensaje del diálogo
   * @returns {Promise} - Promesa que se resuelve cuando se cierra el diálogo
   */
  success: ({
    title = '¡Completado!',
    message = 'Operación realizada con éxito'
  }) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6'
    });
  },

  /**
   * Muestra un diálogo de error
   * @param {string} title - Título del diálogo
   * @param {string} message - Mensaje del diálogo
   * @returns {Promise} - Promesa que se resuelve cuando se cierra el diálogo
   */
  error: ({
    title = 'Error',
    message = 'Se ha producido un error'
  }) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#3085d6'
    });
  },

  /**
   * Cierra todos los diálogos activos
   */
  close: () => {
    Swal.close();
  }
};

export default AlertDialog;
