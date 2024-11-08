import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserForm from "../components/LocalConfig/UserForm"; // Importamos el componente de formulario
import axios from "axios";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const UserPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Función para obtener los usuarios desde la API usando axios
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(
        `${backend}api/usuarios/local/${localId}`
      );
      setUsuarios(response.data); // axios maneja automáticamente la respuesta como JSON
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar los usuarios según su rol
  const admins = usuarios.filter((user) => user.role === "admin");
  const cajeros = usuarios.filter((user) => user.role === "cajero");
  console.log(cajeros);
  const meseros = usuarios.filter((user) => user.role === "mesero");

  const handleCreateUser = (userData) => {
    const url = userData._id
      ? `${backend}api/usuarios/${userData._id}` // Editar
      : `${backend}api/usuarios`; // Crear

    const method = userData._id ? "PUT" : "POST";

    axios({
      method,
      url,
      data: userData,
    });
    console
      .log(userData)
      .then((res) => {
        setUsuarios((prev) =>
          userData._id
            ? prev.map((user) => (user._id === res.data._id ? res.data : user))
            : [...prev, res.data]
        );
        setShowForm(false); // Cerrar el formulario después de enviar
      })
      .catch((err) =>
        console.error("Error al crear o editar el usuario:", err)
      );
  };

  return (
    <section className="absolute h-screen w-full flex flex-col items-center justify-center ">
      <div className="flex items-center justify-center mx-auto p-4">
        {/* Administradores */}
        <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-md w-96">
          <h2 className="text-xl font-bold text-gray-700">Administradores</h2>
          <motion.div
            className="flex flex-col items-center space-y-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {admins.length > 0 ? (
              <div className="bg-blue-100 p-4 rounded-md">
                <p className="text-gray-700">{admins[0].username}</p>
              </div>
            ) : (
              <p className="text-gray-500">No hay administradores.</p>
            )}
          </motion.div>
        </div>
      </div>
      <div className="flex items-center justify-center mx-auto gap-6 p-4">
      {/* Cajeros */}
      <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-md w-96">
        <h2 className="text-xl font-bold text-gray-700">Cajeros</h2>
        <AnimatePresence>
          <motion.div
            className="flex flex-col items-center space-y-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {cajeros.length > 0 ? (
              cajeros.map((user) => (
                <motion.div
                  key={user._id}
                  className="bg-green-100 p-4 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-700">{user.username}</p>
                  <button
                    onClick={() => {
                      setUserToEdit(user);
                      setShowForm(true);
                    }}
                    className="text-blue-500 mt-2"
                  >
                    Editar
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No hay cajeros.</p>
            )}
            <button
              onClick={() => {
                setUserToEdit(null); // Crear un nuevo usuario
                setShowForm(true);
              }}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            >
              Crear Cajero
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Meseros */}
      <div className="p-4 bg-white shadow-md rounded-md w-96">
        <h2 className="text-center text-xl font-bold text-gray-700">Meseros</h2>
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-2  place-content-center gap-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {meseros.length > 0 ? (
              meseros.map((user) => (
                <motion.div
                  key={user._id}
                  className="flex flex-col items-center justify-center bg-yellow-100 p-4 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-700">{user.username}</p>
                  <button
                    onClick={() => {
                      setUserToEdit(user);
                      setShowForm(true);
                    }}
                    className="text-blue-500 mt-2"
                  >
                    Editar
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No hay meseros.</p>
            )}
            <button
              onClick={() => {
                setUserToEdit(null); // Crear un nuevo usuario
                setShowForm(true);
              }}
              className="col-span-2 mx-auto mt-4 bg-blue-500 text-white p-2 rounded-md"
            >
              Crear Mesero
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
      </div>

      {/* Formulario de crear/editar usuario */}
      {showForm && (
        <UserForm
          onSubmit={handleCreateUser}
          userToEdit={userToEdit}
          onClose={() => setShowForm(false)}
        />
      )}
    </section>
  );
};

export default UserPage;
