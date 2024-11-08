import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const LocalSettingsModal = ({ isOpen, onClose }) => {
  const [localData, setLocalData] = useState({
    nombre: "",
    nit: "",
    planSuscripcion: "",
    estado: "",
    direccion: "",
    telefono: "",
    paginaWeb: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores

  // Efecto para cargar los datos del local al abrir el modal
  useEffect(() => {
    if (isOpen && localId) {
      // Hacer la solicitud GET a la API para obtener los datos del local
      axios
        .get(`${backend}api/locales/${localId}`)
        .then((response) => {
          setLocalData(response.data);
        })
        .catch((error) => {
          console.error("Error al cargar los datos del local:", error);
        });
    }
  }, [isOpen, localId]); // Solo se ejecuta cuando el modal se abre y localId cambia

  const handleEditClick = () => {
    setIsEditing(true); // Activar el modo de edición (abrir modal)
  };

  const handleSaveClick = () => {
    setIsLoading(true); // Indicar que estamos enviando la solicitud
    setError(null); // Limpiar cualquier error previo

    // Realizar la solicitud PUT para actualizar el local
    axios
      .put(`${backend}api/locales/${localId}`, localData)
      .then((response) => {
        // Si la respuesta es exitosa, podemos cerrar el modal
        setIsEditing(false);
        setIsLoading(false);
        onClose(); // Cerrar el modal
        alert("Los cambios fueron guardados correctamente."); // Mensaje de éxito (puedes cambiarlo)
      })
      .catch((error) => {
        // Si ocurre un error, lo mostramos
        setIsLoading(false);
        setError("Hubo un error al guardar los cambios. Intenta nuevamente.");
        console.error("Error al guardar los cambios:", error);
      });
  };

  const handleCloseModal = () => {
    onClose(); // Llamar la función de cierre cuando se presione Cancelar
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
            initial={{ y: -100, scale: 0.5 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 100, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 className="text-2xl font-semibold text-teal-600 mb-4">
              {isEditing ? "Editar Local" : "Configuración del Local"}
            </motion.h2>

            {!isEditing ? (
              <motion.div className="space-y-4">
                <motion.h3 className="text-lg font-medium text-teal-600">{localData.nombre}</motion.h3>
                <motion.p className="text-gray-700">NIT: {localData.nit}</motion.p>
                <motion.p className="text-gray-700">Plan: {localData.planSuscripcion}</motion.p>
                <motion.p className="text-gray-700">Estado: {localData.estado}</motion.p>
                <motion.p className="text-gray-700">Dirección: {localData.direccion}</motion.p>
                <motion.p className="text-gray-700">Teléfono: {localData.telefono}</motion.p>
                <motion.p className="text-gray-700">Página Web: {localData.paginaWeb}</motion.p>

                <motion.button
                  onClick={handleEditClick}
                  className="w-full mt-6 py-2 bg-teal-600 text-white rounded-md shadow-lg transform hover:scale-105 hover:bg-teal-700 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Editar Local
                </motion.button>
              </motion.div>
            ) : (
              <motion.div className="space-y-4">
                <motion.input
                  type="text"
                  value={localData.nombre}
                  onChange={(e) => setLocalData({ ...localData, nombre: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Nombre del Local"
                />
                
                {/* Campo NIT deshabilitado */}
                <motion.input
                  type="text"
                  value={localData.nit}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-200"
                  placeholder="NIT (No editable)"
                />
                
                {/* Campo Plan Suscripción deshabilitado */}
                <motion.input
                  type="text"
                  value={localData.planSuscripcion}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-200"
                  placeholder="Plan (No editable)"
                />
                
                {/* Campo Estado deshabilitado */}
                <motion.input
                  type="text"
                  value={localData.estado}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-200"
                  placeholder="Estado (No editable)"
                />
                
                <motion.input
                  type="text"
                  value={localData.direccion}
                  onChange={(e) => setLocalData({ ...localData, direccion: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Dirección"
                />
                <motion.input
                  type="text"
                  value={localData.telefono}
                  onChange={(e) => setLocalData({ ...localData, telefono: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Teléfono"
                />
                <motion.input
                  type="text"
                  value={localData.paginaWeb}
                  onChange={(e) => setLocalData({ ...localData, paginaWeb: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Página Web"
                />

                {error && <motion.p className="text-red-600 text-sm">{error}</motion.p>}

                <div className="flex justify-between mt-4">
                  <motion.button
                    onClick={handleSaveClick}
                    className="py-2 px-4 bg-teal-600 text-white rounded-md shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading} // Deshabilitar el botón mientras se carga
                  >
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </motion.button>
                  <motion.button
                    onClick={handleCloseModal}
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LocalSettingsModal;
