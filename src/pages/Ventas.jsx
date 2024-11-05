import React, { useEffect, useState } from "react";
import axios from "axios";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    const today = new Date();
    // Obtener la fecha local sin la hora
    return today.toLocaleDateString('en-CA'); // Esto devuelve la fecha en formato YYYY-MM-DD
  });

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backend}api/pagos/ventasHoy`, {
          params: {
            localId: localId,
            fecha: fechaSeleccionada,
          },
        });
        setVentas(response.data);
      } catch (error) {
        setError("Error al cargar las ventas. Intenta nuevamente.");
        console.error("Error fetching ventas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [localId, fechaSeleccionada]);

  const indexOfLastVenta = currentPage * itemsPerPage;
  const indexOfFirstVenta = indexOfLastVenta - itemsPerPage;
  const currentVentas = ventas.slice(indexOfFirstVenta, indexOfLastVenta);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(ventas.length / itemsPerPage);

  const handleDelete = async (ventaId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta venta?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${backend}api/pagos/${ventaId}`);
        setVentas(ventas.filter((venta) => venta._id !== ventaId));
        alert('Venta Eliminada')
      } catch (error) {
        console.error("Error al eliminar la venta:", error);
        alert("Ocurrió un error al intentar eliminar la venta.");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Ventas del Día</h2>
      <div className="mb-4 flex justify-center">
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          className="border border-gray-300 rounded p-2 mr-4 focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button
          onClick={() =>
            setFechaSeleccionada(new Date().toLocaleDateString('en-CA'))
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Hoy
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : currentVentas.length === 0 ? (
        <p className="text-gray-500 text-center">No se encontraron ventas para la fecha seleccionada.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {currentVentas.map((venta) => (
            <div
              key={venta._id}
              className="p-4 bg-white rounded-lg shadow-lg border-2 transition-transform transform hover:scale-105 h-80 overflow-auto"
            >
              <h3 className="font-bold">Consecutivo: {venta.consecutivo}</h3>
              <p className="italic">Nombre: {venta.nombre}</p>
              <p className="font-bold text-lg text-green-600">
                Monto Total: ${venta.valorTotal}
              </p>
              <p className="italic">
                Fecha y hora:{" "}
                {new Date(venta.creado).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <h4 className="font-semibold mt-2">Productos:</h4>
              <ul className="list-disc list-inside">
                {venta.productos.map((producto) => (
                  <li key={producto._id}>
                    {producto.nombreProducto} - Cantidad: {producto.cantidad} - Total: ${producto.valorTotal}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-evenly mx-auto">
                <button className="m-4 bg-blue-400 hover:bg-blue-300 rounded-full p-2 group">
                  {/* Icono para editar (puedes agregar funcionalidad si lo deseas) */}
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
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                    />
                  </svg>
                </button>
                <button
                  className="m-4 bg-red-400 hover:bg-red-300 rounded-full p-2"
                  onClick={() => handleDelete(venta._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded transition duration-200 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Ventas;
