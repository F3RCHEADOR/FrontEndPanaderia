// src/AdministracionVentas.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Ventas from '../assets/ventas.png'; 
import Business from '../assets/business.png'; 

const AdministracionVentas = () => {
  const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

  const handleNavigate = (path) => {
    navigate(path); // Cambia a navigate
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Administración de Ventas</h1>
      <div className="w-full grid grid-cols-1 gap-8 sm:grid-cols-2 p-4">
        <div
          onClick={() => handleNavigate("/informes")}
          className="flex flex-col items-center justify-center h-64 sm:h-80 bg-blue-500 text-white rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-blue-600 p-4"
        >
          <img
            src={Business}
            alt="business"
            className="h-16 mb-2" // Ajusta la altura de la imagen y el margen
          />
          <h2 className="text-2xl font-semibold">Informes</h2>
        </div>
        <div
          onClick={() => handleNavigate("/ventas")}
          className="flex flex-col items-center justify-center h-64 sm:h-80 bg-green-500 text-white rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-green-600 p-4"
        >
          <img
            src={Ventas}
            alt="ventas"
            className="h-16 mb-2" // Ajusta la altura de la imagen y el margen
          />
          <h2 className="text-2xl font-semibold">Ventas</h2>
        </div>
      </div>
    </div>
  );
};

export default AdministracionVentas;
