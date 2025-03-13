import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InfoUser = () => {
  const navigate = useNavigate();

  // Estado local para manejar la información del usuario
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  console.log("usuario: ", username, "role: ", role);

  // Cargar los datos de localStorage cuando el componente se monta
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    // Actualizamos el estado con los valores almacenados
    setUsername(storedUsername);
    setRole(storedRole);
  }, []); // Solo se ejecuta una vez, cuando el componente se monta

  // Función que maneja la confirmación para redirigir al login
  const handleLogout = () => {
    const confirmExit = window.confirm(
      "¿Estás seguro de que quieres cerrar sesión y salir?"
    );

    if (confirmExit) {
     
      localStorage.removeItem("username");
      localStorage.removeItem("role");

      navigate("/login");
    }
  };

  // Mostrar un mensaje de carga mientras esperamos que los datos estén disponibles
  if (username === null || role === null) {
    return <div>Cargando...</div>;
  }

  return (
    <section className="bg-white w-full h-full p-2 rounded-xl shadow-md border border-gray-300 max-w-xs mx-auto">
      {/* Sección de Usuario */}
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Mostrar el rol solo si existe */}
        <span className="italic font-medium text-gray-600">
          {role ? `Rol: ${role}` : "Rol no disponible"}
        </span>
      </div>

      {/* Sección de Logout */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={handleLogout}
          type="button"
          className="bg-red-500 text-white px-2 py-2 rounded-full text-sm text-clip font-semibold flex items-center justify-center hover:bg-red-600 transition duration-200 ease-in-out"
        >
          <span className="">Cerrar Sesión</span>
        </button>
      </div>
    </section>
  );
};

export default InfoUser;
