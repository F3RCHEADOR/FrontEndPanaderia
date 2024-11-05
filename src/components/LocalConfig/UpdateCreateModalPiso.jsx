import React, { useEffect, useState } from "react";

const UpdatePisoModal = ({ isOpen, onClose, onSubmit, piso }) => {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (piso) {
      setNombre(piso.nombre);
    } else {
      setNombre("");
    }
  }, [piso]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre) {
      alert("Por favor, ingresa un nombre para el piso.");
      return;
    }

    const pisoData = {
      nombre,
    };

    // Confirmación antes de enviar
    const action = piso ? "actualizar" : "crear";
    if (window.confirm(`¿Estás seguro de que deseas ${action} este piso?`)) {
      onSubmit(pisoData);
      alert(`Piso ${action}do con éxito.`);
    }
  };

  return (
    <div className={`fixed inset-0 max-w-xl mx-auto flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-xl font-bold mb-4">{piso ? "Actualizar Piso" : "Crear Piso"}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nombre del Piso:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border rounded p-2 w-full capitalize"
              required
            />
          </div>

          <div className="flex justify-between md:justify-end">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              {piso ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePisoModal;
