import React, { useState, useEffect } from "react";
import FlechaArriba from "../../assets/sistema/arrowUp.jsx";
import Home from "../../assets/sistema/hogar.png";
import Productos from "../../assets/sistema/dairy.png";
import Cash from "../../assets/sistema/money.png";
import Cuenta from '../../assets/sistema/equipo-de-usuario.png';
import { Link } from "react-router-dom";

function Footer() {
  const [role, setRole] = useState(null); // Estado inicial como null para indicar que aún no se ha cargado el rol
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    // Obtener el rol de localStorage cuando el componente se monta
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || ""); // Establecer el rol en el estado o una cadena vacía si no está definido
  }, []);

  useEffect(() => {
 
    console.log("Role actualizado:", role);
  }, [role]);

  const toggleFooter = () => {
    setIsFooterVisible((prevState) => !prevState);
  };

  return (
    <>
      <button
        id="toggleFooter"
        className={`fixed ${isFooterVisible ? "bottom-8" : "-bottom-2"} z-50 left-1/2 transform -translate-x-1/2 p-1 m-2 bg-white rounded-full transition-transform ${isFooterVisible ? "rotate-180" : "rotate-0"}`}
        onClick={toggleFooter}
      >
        <FlechaArriba />
      </button>
      <footer
        id="footer"
        className={`fixed bottom-0 left-0 w-full h-auto select-none bg-blue-50 border-t-8 border-blue-400 transition-all ${isFooterVisible ? "block" : "hidden"}`}
      >
        <ul className="flex items-center justify-around text-lg font-bold mt-2">
          <li className="border-l-8 pb-1 border-r-8 px-2 hover:scale-105 duration-200">
            <Link to={"Home"} className="flex flex-row items-center">
              <img src={Home} className="size-12" />
              <span className="hidden md:block">Inicio</span>
            </Link>
          </li>

          {/* Mostrar productos, inventarios y ventas solo si el rol es admin o cajero */}
          {role && (role === "admin" || role === "cajero") && (
            <>
              <li className="border-l-8 pb-1 border-r-8 px-2 hover:scale-105 duration-200">
                <Link to={"Second"} className="flex flex-row items-center">
                  <img src={Productos} className="size-12" />
                  <span className="hidden md:block">Productos</span>
                </Link>
              </li>
           
              <li className="border-l-8 pb-1 border-r-8 px-2 hover:scale-105 duration-200">
                <Link to={"MenuVentas"} className="flex flex-row items-center">
                  <img src={Cash} className="size-12" />
                  <span className="hidden md:block">Ventas</span>
                </Link>
              </li>
            </>
          )}

          {/* Mostrar cuenta solo si el rol es admin */}
          {role === "admin" && (
            <li className="border-l-8 pb-1 border-r-8 px-2 hover:scale-105 duration-200">
              <Link to={"Configuration"} className="flex flex-row items-center">
                <img src={Cuenta} className="size-12" />
                <span className="hidden md:block">Cuenta</span>
              </Link>
            </li>
          )}
        </ul>
      </footer>
    </>
  );
}

export default Footer;
