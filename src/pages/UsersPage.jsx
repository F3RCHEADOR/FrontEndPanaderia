import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserForm from "../components/LocalConfig/UserForm";
import Admin from "../assets/sistema/trabajando.png";
import Cajero from "../assets/sistema/cajero.png";
import Mesero from "../assets/sistema/camarero.png";
import axios from "axios";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const UserPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(
        `${backend}api/usuarios/local/${localId}`
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreateUser = (userData) => {
    const url = userData._id
      ? `${backend}api/usuarios/${userData._id}`
      : `${backend}api/usuarios`;

    const method = userData._id ? "PUT" : "POST";

    axios({
      method,
      url,
      data: userData,
    })
      .then((res) => {
        setUsuarios((prev) =>
          userData._id
            ? prev.map((user) => (user._id === res.data._id ? res.data : user))
            : [...prev, res.data]
        );
        setShowForm(false);
        alert("Operación Exitosa");
      })
      .catch((err) =>
        console.error("Error al crear o editar el usuario:", err)
      );
  };

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (confirmed) {
      axios
        .delete(`${backend}api/usuarios/${userId}`)
        .then(() => {
          setUsuarios((prev) => prev.filter((user) => user._id !== userId));
          alert("Usuario Eliminado");
        })
        .catch((err) => console.error("Error al eliminar el usuario:", err));
    }
  };

  const admins = usuarios.filter((user) => user.role === "admin");
  const cajeros = usuarios.filter((user) => user.role === "cajero");
  const meseros = usuarios.filter((user) => user.role === "mesero");

  const adminPermissions = [
    "Gestionar Clientes",
    "Gestionar usuarios",
    "Gestionar roles",
    "Gestionar productos",
    "Gestionar ventas",
    "Ver reportes",
    "Acceso completo",
  ];

  const cajeroPermissions = [
    "Gestionar productos",
    "Gestión de cajas",
    "Crear ventas",
    "Eliminar ventas",
    "Asignar clientes",
    "Crear clientes",
    "Editar clientes",
    "Eliminar clientes",
  ];

  const meseroPermissions = [
    "Crear clientes",
    "Eliminar clientes",
    "Asignar mesas",
    "Editar pedidos",
  ];

  return (
    <section className="min-h-screen w-full flex flex-col items-center py-10 bg-gray-100">
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Gestión de Usuarios
      </motion.h1>

      <div className="flex flex-col md:flex-row items-center justify-center mx-auto gap-6 p-4 w-full max-w-4xl">
        {/* Sección Administradores */}
        <motion.div
          className="flex flex-col items-center justify-center mx-auto bg-white p-4 shadow-lg rounded-md w-full max-w-xs md:max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Administradores
          </h2>
          {admins.length > 0 ? (
            admins.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-2 bg-gray-50 p-4 rounded-md w-full"
              >
                <img src={Admin} alt="Admin" className="size-16"></img>
                <p className="text-gray-700 text-center font-bold italic">
                  {user.username}
                </p>
                <button
                  onClick={() => {
                    setUserToEdit(user);
                    setShowForm(true);
                  }}
                  className="text-yellow-500 mt-2 mx-auto p-1 border-2 border-gray-700 rounded-md hover:scale-105 transform transition-all "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay Administradores.</p>
          )}

          <details className="mt-4 w-full">
            <summary className="text-gray-700 font-medium cursor-pointer">
              Ver permisos de Admin
            </summary>
            <ul className="list-disc ml-5 text-sm text-gray-700 mt-2">
              {adminPermissions.map((perm, index) => (
                <li key={index}>{perm}</li>
              ))}
            </ul>
          </details>
        </motion.div>

        {/* Sección Cajeros */}
        <motion.div
          className="flex flex-col items-center bg-white p-4 shadow-lg rounded-md w-full max-w-xs md:max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Cajeros</h2>
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
                    className="flex flex-col items-center bg-blue-50  p-4 rounded-md text-center border-2 border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={Cajero} alt="Cajero" className="size-16"></img>
                    <p className="text-gray-700 font-bold italic">
                      {user.username}
                    </p>
                    <div className="flex items-center justify-between w-full mx-auto">
                      <button
                        onClick={() => {
                          setUserToEdit(user);
                          setShowForm(true);
                        }}
                        className="text-yellow-500 mt-2 p-1 border-2 border-gray-700 rounded-md hover:scale-105 transform transition-all "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 mt-2 p-1 border-2 border-gray-700 rounded-md hover:scale-105 transform transition-all "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">No hay cajeros.</p>
              )}

              <details className="py-4 w-full">
                <summary className="text-gray-700 font-medium cursor-pointer">
                  Ver permisos de Cajero
                </summary>
                <ul className="list-disc ml-5 text-sm text-gray-700 mt-2">
                  {cajeroPermissions.map((perm, index) => (
                    <li key={index}>{perm}</li>
                  ))}
                </ul>
              </details>
              <button
                onClick={() => {
                  setUserToEdit(null);
                  setShowForm(true);
                }}
                className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full"
              >
                Crear Cajero
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Sección Meseros */}
        <motion.div
          className="flex flex-col items-center p-6 bg-white shadow-lg rounded-md w-full max-w-xs md:max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Meseros</h2>
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 place-content-center gap-4 mt-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {meseros.length > 0 ? (
                meseros.map((user) => (
                  <motion.div
                    key={user._id}
                    className="flex flex-col items-center bg-green-50 border-2 border-gray-700 p-3 rounded-md text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={Mesero} alt="Mesero" className="size-16"></img>
                    <p className="text-gray-700 font-bold italic">
                      {user.username}
                    </p>
                    <div className="flex items-center justify-between w-full space-x-1  mx-auto">
                      <button
                        onClick={() => {
                          setUserToEdit(user);
                          setShowForm(true);
                        }}
                        className="text-yellow-500 mt-2 p-1 border-2 border-gray-700 rounded-md hover:scale-105 transform transition-all "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 mt-2 p-1 border-2 border-gray-700 rounded-md hover:scale-105 transform transition-all "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">No hay meseros.</p>
              )}

              <details className="col-span-2 my-2 w-full">
                <summary className="text-gray-700 font-medium cursor-pointer">
                  Ver permisos de Mesero
                </summary>
                <ul className="list-disc ml-5 text-sm text-gray-700 mt-2">
                  {meseroPermissions.map((perm, index) => (
                    <li key={index}>{perm}</li>
                  ))}
                </ul>
              </details>

              <button
                onClick={() => {
                  setUserToEdit(null);
                  setShowForm(true);
                }}
                className="col-span-2 mt-4 bg-blue-500 text-white p-2 rounded-md w-full"
              >
                Crear Mesero
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

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
