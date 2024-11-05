import React, { useEffect, useState } from "react";
import axios from "axios";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);  // Cambiar de 10 a 25
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('en-CA');
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
    <div className="p-4 mx-8">
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
        <div>
          {/* Tabla para mostrar las ventas */}
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Consecutivo</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Monto Total</th>
                <th className="p-2 text-left">Fecha y Hora</th>
                <th className="p-2 text-left">Productos</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentVentas.map((venta) => (
                <tr key={venta._id} className="border-b hover:bg-gray-100">
                  <td className="p-2 border-r-2 border-l-2">{venta.consecutivo}</td>
                  <td className="p-2 border-r-2 border-l-2">{venta.nombre}</td>
                  <td className="p-2 border-r-2 border-l-2 text-green-600">${venta.valorTotal}</td>
                  <td className="p-2 border-r-2 border-l-2">
                    {new Date(venta.creado).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-2 border-r-2">
                    <details className="text-gray-700">
                      <summary>Ver Productos</summary>
                      <div className="flex flex-col mt-2">
                        {venta.productos.map((producto) => (
                          <div key={producto._id} className="flex flex-col p-2 border-b">
                            <div className="mb-2">
                              <span className="font-semibold">Producto:</span> {producto.nombreProducto}
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Cantidad:</span> {producto.cantidad}
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Total:</span> ${producto.valorTotal}
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </td>
                  <td className="p-2 border-r-2">
                    <button
                      className="flex items-center justify-center mx-auto m-2 bg-red-400 hover:bg-red-300 rounded-full p-2"
                      onClick={() => handleDelete(venta._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center mt-4 mb-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded transition duration-200 ${currentPage === index + 1
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
