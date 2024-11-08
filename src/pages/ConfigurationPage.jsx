import React, { useState } from "react";
import { motion } from "framer-motion"; // Para animaciones
import { Link } from "react-router-dom";
import LocalSettingsModal from "../components/LocalConfig/LocalSettingsModal";

import PisoImage from "../assets/piso.png"; // Imagen para el cuadro de "Configurar Pisos"
import LocalImage from "../assets/equipo-de-usuario.png"; // Imagen para el cuadro de "Configurar Local"
import UsuariosImage from "../assets/grupo.png"; // Imagen para el cuadro de "Configurar Usuarios"
import GeneralImage from "../assets/client.png"; // Imagen para el cuadro de "Configuración General"

const ConfigurationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full min-h-[90vh] flex flex-col items-center justify-center px-6 py-8 z-50">
      {/* Título de la página */}
      <motion.h1
        className="text-4xl font-extrabold text-blue-700 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 100 }}
      >
        Menú de Configuración
      </motion.h1>

      {/* Contenedor de los cuadros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 ">
        {/* Cuadro 1: Configurar Pisos */}
        <motion.div
          className="p-6 bg-white shadow-2xl rounded-lg border-4 border-blue-500 hover:border-blue-700 transition duration-300 transform hover:scale-105"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-4">
            <img
              src={PisoImage}
              alt="Configurar Pisos"
              className="mx-auto w-28 object-cover rounded-lg" // Ajusta la imagen para que ocupe el espacio correcto
            />
          </div>
          <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
            Configurar Pisos
          </h2>
          <p className="text-gray-700 text-center">
            Configura los pisos de tu sistema para una gestión eficiente.
          </p>
          <Link to="/PisoPage">
            <motion.button
              className="w-full mt-6 py-2 bg-blue-600 text-white rounded-md shadow-lg transform hover:scale-105 hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Configurar
            </motion.button>
          </Link>
        </motion.div>

        {/* Cuadro 2: Configurar Local */}
        <motion.div
          className="p-6 bg-white shadow-2xl rounded-lg border-4 border-green-500 hover:border-green-700 transition duration-300 transform hover:scale-105"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-4">
            <img
              src={LocalImage}
              alt="Configurar Local"
              className="mx-auto w-28 object-cover rounded-lg"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center text-green-600 mb-4">
            Configurar Local
          </h2>
          <p className="text-gray-700 text-center">
            Gestiona los locales de tu sistema desde esta sección.
          </p>
          <motion.button
            className="w-full mt-6 py-2 bg-green-600 text-white rounded-md shadow-lg transform hover:scale-105 hover:bg-green-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenModal}
          >
            Configurar
          </motion.button>
          <LocalSettingsModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </motion.div>

        {/* Cuadro 3: Configurar Usuarios */}
        <motion.div
          className="p-6 bg-white shadow-2l rounded-lg border-4 border-purple-500 hover:border-purple-700 transition duration-300 transform hover:scale-105"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-4">
            <img
              src={UsuariosImage}
              alt="Configurar Usuarios"
              className="mx-auto w-28 object-cover rounded-lg"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center text-purple-600 mb-4">
            Configurar Usuarios
          </h2>
          <p className="text-gray-700 text-center">
            Configura usuarios y roles para el sistema aquí.
          </p>
          <Link to={'/UserPage'}>
            <motion.button
              className="w-full mt-6 py-2 bg-purple-600 text-white rounded-md shadow-lg transform hover:scale-105 hover:bg-purple-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Configurar
            </motion.button>
          </Link>
        </motion.div>

        {/* Cuadro 4: Configuración General */}
        <motion.div
          className="p-6 bg-white shadow-2xl rounded-lg border-4 border-teal-500 hover:border-teal-700 transition duration-300 transform hover:scale-105"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative mb-4">
            <img
              src={GeneralImage}
              alt="Configuración General"
              className="mx-auto w-28 object-cover rounded-lg"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center text-teal-600 mb-4">
            Configuración General
          </h2>
          <p className="text-gray-700 text-center">
            Realiza configuraciones generales de todo el sistema.
          </p>
          <motion.button
            className="w-full mt-6 py-2 bg-teal-600 text-white rounded-md shadow-lg transform hover:scale-105 hover:bg-teal-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Configurar
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
