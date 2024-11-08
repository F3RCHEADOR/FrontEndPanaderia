import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InfoUser = () => {
    const navigate = useNavigate();

    // Estado local para manejar la información del usuario
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);

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
            // Limpiar los datos de sesión (si lo deseas)
            localStorage.removeItem("username");
            localStorage.removeItem("role");

            // Redirige al login si el usuario confirma
            navigate("/login");
        }
    };

    // Mostrar un mensaje de carga mientras esperamos que los datos estén disponibles
    if (username === null || role === null) {
        return <div>Cargando...</div>;
    }

    return (
        <section className="grid grid-cols-2 gap-8 bg-gray-100 w-full h-full p-2 my-auto border-b-2 border-gray-400 m-1">
            <div className="flex flex-col space-y-2 mt-1 text-center">
                <h2 className="text-lg font-semibold">{username}</h2>
                {/* Mostrar el rol solo si existe */}
                <span className="italic underline">{role ? `Rol: ${role}` : "Rol no disponible"}</span>
            </div>
            <button
                onClick={handleLogout}
                type="button"
                className="bg-red-500 text-white px-1 py-2 rounded-xl flex items-center h-12 justify-center m-auto"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
            </button>
        </section>
    );
};

export default InfoUser;
