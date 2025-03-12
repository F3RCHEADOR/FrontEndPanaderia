import React from "react";
import ButtonPayment from "./Cliente/ButtonPayment";
import ButtonEditClient from "./Cliente/ButtonEditClient";

const InfoMesa = ({ mesa, onClose }) => {
  if (!mesa) return null;

  // Campo adicional: tipoCliente
  const clienteConTipo = {
    ...mesa,
    tipoCliente: "Mesa", // Puedes cambiar esto si deseas agregar un tipo de cliente específico
  };

  console.log(mesa);

  // Asegúrate de que la propiedad `productos` exista y es un array
  const productos = Array.isArray(mesa.productos) ? mesa.productos : [];

  // Calcular el valor acumulado sumando los valorTotal de los productos
  const valorAcumulado = productos.reduce(
    (acc, producto) => acc + producto.valorTotal,
    0
  );

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-50 border-4 h-auto max-h-80 overflow-auto w-96 p-4 bg-white shadow-md rounded">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 font-extrabold hover:scale-125 text-white p-2 m-1 rounded-full bg-red-300"
      >
        X
      </button>
      <h3 className="text-xl font-semibold text-center bg-orange-300 capitalize">
        Mesa {mesa.nombre}
      </h3>
      <img
        src={mesa.imagen}
        alt={`Mesa ${mesa.nombre}`}
        className="w-28 mx-auto my-2"
      />

      <p className="pl-4">
        <strong>Valor Acumulado:</strong> ${valorAcumulado}
      </p>

      <div className="grid grid-cols-4 gap-4 pl-4 font-bold">
        <h4 className="col-span-2">Productos</h4>
        <h4 className="mr-4">Cantidad</h4>
        <h4 className="ml-2">Precio</h4>
      </div>

      <ul className="list-disc list-inside ml-4 pl-2 bg-gray-100">
        {productos.length > 0 ? (
          <>
            {productos.map((producto, index) => (
              <li className="grid grid-cols-4 gap-6 hover:bg-white" key={index}>
                <span className="col-span-2">-{producto.nombreProducto}</span>
                <span className="text-center">{producto.cantidad}</span>
                <span className="text-center">${producto.valorTotal}</span>
              </li>
            ))}
            <br />
            <div className="flex items-center justify-between font-extrabold pr-1">
              <span>Total a Pagar:</span>
              <span>${valorAcumulado}</span>
            </div>
          </>
        ) : (
          <li>No hay productos</li>
        )}
      </ul>
      {valorAcumulado !== 0 && (
        <>
          <ButtonEditClient cliente={clienteConTipo} />
          <ButtonPayment cliente={clienteConTipo} />
        </>
      )}
    </div>
  );
};

export default InfoMesa;
