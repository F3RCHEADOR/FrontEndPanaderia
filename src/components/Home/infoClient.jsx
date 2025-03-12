import clienteImagen from "../../assets/sistema/client.png";
import ButtonPayment from "../Cliente/ButtonPayment";
import ButtonEditClient from "../Cliente/ButtonEditClient";
import React, { useState, useEffect } from "react";

const ClientInfo = ({ cliente, onClose, onDelete }) => {
  const [role, setRole] = useState(null);
  if (!cliente) return null;

  const clienteConTipo = {
    ...cliente,
    tipoCliente: "Cliente", // Puedes cambiar esto si deseas agregar un tipo de cliente específico
  };

  console.log(cliente);
  // Calcular el valor total acumulado de los productos
  const valorAcumulado = cliente.productos.reduce(
    (total, producto) => total + producto.valorTotal,
    0
  );

  useEffect(() => {
    // Obtener el rol de localStorage cuando el componente se monta
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || ""); // Establecer el rol en el estado o una cadena vacía si no está definido
  }, []);

  return (
    <div className="fixed z-50 top-20 md:left-48 w-60 h-auto max-h-80 overflow-auto p-4 bg-white border-4 shadow-lg rounded-xl">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-900 font-bold rounded-full px-2 py-1 bg-red-400"
      >
        X
      </button>
      <img src={clienteImagen} alt={cliente._id} className="w-16 mx-auto" />
      <h2 className="text-lg font-semibold text-center bg-gray-100">
        {cliente.nombre || "Cliente Recurrente"}
      </h2>
      <ul className="space-y-1 mb-2 ">
        {cliente.productos.map((producto) => (
          <li
            key={producto._id}
            className="flex justify-between p-2 bg-gray-50 rounded text-sm space-x-6"
          >
            <span>{producto.nombreProducto}</span>
            <span>${producto.valorTotal}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between font-semibold border-4 p-1 rounded-xl">
        <span>Total:</span>
        <span>${valorAcumulado}</span>
      </div>
      {role && (role === "admin" || role === "cajero") && (
        <ButtonEditClient cliente={clienteConTipo} />
      )}
      <ButtonPayment cliente={clienteConTipo} />
      <button
        onClick={() => onDelete(cliente._id)}
        className="mt-2 w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Eliminar Cliente
      </button>
    </div>
  );
};

export default ClientInfo;
