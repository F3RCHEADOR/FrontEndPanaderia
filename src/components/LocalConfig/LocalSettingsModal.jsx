import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Información inicial del local
const initialLocalData = {
  nombre: "Restaurante El Buen Sabor",
  nit: "123456789",
  plan: "Premium",
  estado: "Activo",
  direccion: "Calle Ficticia 123, Ciudad",
  telefono: "555-1234",
  paginaWeb: "www.buensabor.com",
};

const LocalSettingsModal = ({ isOpen, onClose }) => {
  const [localData, setLocalData] = useState(initialLocalData);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true); // Activar el modo de edición (abrir modal)
  };

  const handleSaveClick = () => {
    setIsEditing(false); // Guardar los cambios y cerrar el modal
    // Aquí podrías guardar los datos en algún backend o hacer algo con ellos.
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
                <motion.p className="text-gray-700">Plan: {localData.plan}</motion.p>
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
                <motion.input
                  type="text"
                  value={localData.nit}
                  onChange={(e) => setLocalData({ ...localData, nit: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="NIT"
                />
                <motion.input
                  type="text"
                  value={localData.plan}
                  onChange={(e) => setLocalData({ ...localData, plan: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Plan"
                />
                <motion.input
                  type="text"
                  value={localData.estado}
                  onChange={(e) => setLocalData({ ...localData, estado: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Estado"
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

                <div className="flex justify-between mt-4">
                  <motion.button
                    onClick={handleSaveClick}
                    className="py-2 px-4 bg-teal-600 text-white rounded-md shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Guardar Cambios
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
