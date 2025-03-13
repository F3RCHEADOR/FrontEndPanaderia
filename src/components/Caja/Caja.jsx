import React, { useState, useEffect } from "react";
import CajaRegistradora from "../../assets/sistema/cashRegister.png";
import Money from "../../assets/sistema/money.png";
import Client from "../../assets/sistema/client.png";
import Ventas from "../../assets/sistema/ventas.png";
import { Link } from "react-router-dom";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

function Caja() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [tipoCaja, setTipoCaja] = useState(null); // Inicializa el estado de tipoCaja
  const [ultimaCaja, setUltimaCaja] = useState(null); // Estado para almacenar la última caja
  const [role, setRole] = useState(null);

  useEffect(() => {
    const obtenerEstadoCaja = async () => {
      try {
        const response = await fetch(
          `${backend}api/cajas/ultima-caja/${localId}`
        );
        if (!response.ok)
          throw new Error("Error al obtener el estado de la caja");

        const data = await response.json();
        setUltimaCaja(data.ultimaCaja); // Guarda la última caja

        // Determina el tipo de caja para la siguiente operación
        if (data) {
          setTipoCaja(
            data.ultimaCaja.tipoCaja === "cierre" ? "Abrir" : "Cerrar"
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    obtenerEstadoCaja(); // Ejecuta la función para obtener el estado de la caja
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  useEffect(() => {
    // Obtener el rol de localStorage cuando el componente se monta
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || ""); // Establecer el rol en el estado o una cadena vacía si no está definido
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div>
      <div className="relative flex bg-white items-center justify-center">
        <div className="relative">
          <button onClick={toggleMenu}>
            <img
              src={CajaRegistradora}
              alt=""
              className="size-16 trasform transition-all hover:scale-105"
            />
          </button>
          <span
            className={`absolute top-1/2 -left-1/2 -translate-x-1/2 sm:left-1/2 sm:translate-x-1/3 -translate-y-1/2 transform p-1 border-2 ${
              tipoCaja == "Cerrar"
                ? "border-blue-400 bg-blue-100"
                : "border-red-400 bg-red-100"
            } rounded-md text-nowrap font-bold italic text-sm`}
          >
            {tipoCaja == "Cerrar" ? "Caja Abierta" : "Caja Cerrada"}
          </span>
        </div>
        <div
          className={`${
            isMenuVisible ? "block" : "hidden"
          } absolute bg-white translate-y-20 mt-36 md:mt-20 w-56 sm:w-96 border-4 rounded-xl p-2 z-20`}
        >
          <div
            className={`grid ${
              role && (role === "admin" || role === "cajero")
                ? "grid-cols-2 md:grid-cols-3"
                : "gird-cols-1"
            } gap-4 font-bold text-xs xl:text-sm text-center`}
          >
            {tipoCaja === "Cerrar" ? (
              <Link
                to="/AddClient"
                className="border-4 p-1 rounded-xl hover:scale-105 duration-200"
              >
                <img
                  src={Client}
                  alt="Agregar Cliente"
                  className="size-12 xl:size-16 mx-auto"
                />
                <span>Agregar Cliente</span>
              </Link>
            ) : (
              <div className="border-4 p-1 m-auto">
                <span>Abre la caja para crear clientes</span>
              </div>
            )}
            {role && (role === "admin" || role === "cajero") && (
              <Link
                to="/ContadorBilletes"
                className={`${
                  tipoCaja === "Cerrar" ? "bg-red-300" : "bg-blue-300"
                } border-4 p-1 rounded-xl hover:scale-105 duration-200`}
              >
                <img
                  src={Money}
                  alt="Caja"
                  className="size-12 xl:size-16 mx-auto"
                />
                <span>{tipoCaja} Caja</span>
              </Link>
            )}
            {role && (role === "admin" || role === "cajero") && (
              <Link
                to="/Ventas"
                className="border-4 p-1 rounded-xl hover:scale-105 duration-200"
              >
                <img
                  src={Ventas}
                  alt="Ventas"
                  className="size-12 xl:size-16 mx-auto"
                />
                <span>Ventas</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 w-full h-8 my-1">
        <div className="col-span-1 border-4 bg-slate-300"></div>
        <div className="col-span-2 border-4 bg-slate-300"></div>
        <div className="col-span-1 border-4 bg-slate-300"></div>
      </div>
    </div>
  );
}

export default Caja;
