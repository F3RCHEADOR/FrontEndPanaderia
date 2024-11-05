import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import InfoMesa from "../components/infoMesa";
import Reloj from "../components/Reloj";

// Definir el tipo de item que aceptamos (CLIENT)
const ItemTypes = {
  CLIENT: "client", // Tipo de item que se va a soltar
};

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const Mesa = ({ mesa, selectedMesa, onMesaClick, actualizarMesas }) => {
  // Hook de useDrop para manejar el dropeo
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CLIENT, // Aceptamos solo clientes
      canDrop: () => mesa.estado !== "Ocupado", // No permitir el dropeo si la mesa está ocupada
      drop: async (item) => {
        console.log("Cliente dropeado en mesa:", mesa.nombre);
        console.log("Item dropeado:", item);

        // Actualizamos la mesa con los productos del cliente
        await actualizarMesaConCliente(item);

        // Eliminamos al cliente de la base de datos
        await eliminarClienteDeLaBaseDeDatos(item._id);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(), // Si el item está sobre la mesa
        canDrop: monitor.canDrop(), // Si se puede soltar el item sobre la mesa
      }),
    }),
    [mesa]
  );

  // Función para actualizar la mesa con los productos del cliente
  const actualizarMesaConCliente = async (item) => {
    try {
      // Combinar productos existentes con los nuevos productos del cliente
      const productosActualizados = [
        ...mesa.productos, // Mantener los productos que ya están en la mesa
        ...item.productos, // Agregar los nuevos productos del cliente
      ];

      // Hacer la solicitud PUT para actualizar la mesa
      const response = await axios.put(`${backend}api/mesas/${mesa._id}`, {
        nombre: mesa.nombre, // Nombre de la mesa
        productos: productosActualizados, // Actualizamos los productos
        estado: "Ocupado", // El estado de la mesa será "Ocupado"
        imagen: mesa.imagen, // Imagen asociada a la mesa
        piso: mesa.piso._id, // ID del piso donde está la mesa
      });

      // Si la respuesta es exitosa, podemos actualizar la UI de la mesa
      console.log("Mesa actualizada con cliente:", response.data);
      onMesaClick(null); // Cerrar la información de la mesa si estaba abierta
      actualizarMesas(); // Actualizar la lista de mesas en el frontend
      alert("La mesa se ocupó con éxito");
    } catch (error) {
      console.error("Error al actualizar la mesa con cliente:", error);
      alert("Error al actualizar la mesa con los datos del cliente");
    }
  };

  // Función para eliminar al cliente de la base de datos
  const eliminarClienteDeLaBaseDeDatos = async (clienteId) => {
    try {
      const response = await axios.delete(`${backend}api/clientes/${clienteId}`);
      console.log("Cliente eliminado de la base de datos:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar el cliente de la base de datos:", error);
      alert("Error al eliminar el cliente de la base de datos");
    }
  };

  const mesaBackgroundColor =
    mesa.estado === "Ocupado" ? "bg-red-300" : "bg-green-200";

  return (
    <div
      ref={drop} // Aquí se agrega la referencia al drop area
      className={`relative border-2 rounded-xl p-6 h-auto ${mesaBackgroundColor}`}
    >
      <button
        className="flex items-center justify-center w-full"
        onClick={() => onMesaClick(mesa._id)}
      >
        <img
          src={mesa.imagen}
          alt={`Mesa ${mesa._id}`}
          className="w-24 xl:w-32 p-1 bg-white rounded-xl mx-auto transition-all shadow-md"
        />
      </button>
      {selectedMesa === mesa._id && (
        <InfoMesa mesa={mesa} onClose={() => onMesaClick(null)} />
      )}
      <div className="absolute top-2 right-2 p-1 m-1 bg-gray-800 text-white rounded-full font-bold capitalize">
        {mesa.nombre}
      </div>
      <div
        className={`absolute bottom-1 border-2 italic border-white left-2 px-4 m-1 ${
          mesa.estado === "libre" ? "bg-green-500" : "bg-red-500"
        } rounded-full font-bold text-white capitalize`}
      >
        {mesa.estado === "libre" ? "Libre" : "Ocupado"}
      </div>
    </div>
  );
};

const MesaList = () => {
  const [mesas, setMesas] = useState([]);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [tipoCaja, setTipoCaja] = useState(null);
  const [pisos, setPisos] = useState([]);
  const [selectedPiso, setSelectedPiso] = useState(null);

  useEffect(() => {
    const obtenerEstadoCaja = async () => {
      try {
        const response = await axios.get(`${backend}api/cajas/ultima-caja`);
        if (response.data) {
          setTipoCaja(
            response.data.ultimaCaja.tipoCaja === "cierre"
              ? "Cerrada"
              : "Abierta"
          );
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al verificar el estado de la caja");
      }
    };

    const fetchData = async () => {
      try {
        const mesasResponse = await axios.get(`${backend}api/mesas`);
        setMesas(mesasResponse.data);

        const pisosResponse = await axios.get(
          `${backend}api/pisos/local/${localId}`
        );
        setPisos(pisosResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    obtenerEstadoCaja();
    fetchData();
  }, []);

  const handleMesaClick = (codigo) => {
    setSelectedMesa(selectedMesa === codigo ? null : codigo);
  };

  const actualizarMesas = async () => {
    try {
      const mesasResponse = await axios.get(`${backend}api/mesas`);
      setMesas(mesasResponse.data);
    } catch (error) {
      console.error("Error al actualizar las mesas", error);
    }
  };

  const mesasFiltradas = selectedPiso
    ? mesas.filter((mesa) => mesa.piso._id === selectedPiso)
    : mesas;

  return (
    <div className="px-2 md:px-6 my-2 md:mt-4 bg-white text-gray-800 h-full mb-8 lg:mb-24 w-full">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-4">
        <div className="flex items-center justify-between space-x-4">
          <h2 className="text-lg md:text-2xl font-bold text-center">
            Lista de Mesas
          </h2>
          <p
            className={`${
              tipoCaja === "Cerrada" ? "bg-red-200" : "bg-blue-200"
            } p-0.5 rounded-full font-bold italic`}
          >
            Caja {tipoCaja}
          </p>
        </div>
        <Reloj />
      </div>
      <div className="mb-4 flex space-x-4">
        {pisos.map((piso) => (
          <button
            key={piso._id}
            onClick={() =>
              setSelectedPiso(piso._id === selectedPiso ? null : piso._id)
            }
            className={`py-2 px-2 md:px-4 rounded-lg transition-all duration-300 ${
              selectedPiso === piso._id
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gray-300 text-gray-800 hover:bg-green-400"
            }`}
          >
            {piso.nombre}
          </button>
        ))}
        <button
          onClick={() => setSelectedPiso(null)}
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            selectedPiso === null
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gray-300 text-gray-800 hover:bg-green-400"
          }`}
        >
          Todos
        </button>
      </div>
      <div
        className={`grid grid-cols-2 md:grid-cols-4 place-content-center max-w-screen-xl mx-auto gap-8 my-8`}
      >
        {mesasFiltradas.map((mesa) => (
          <Mesa
            key={mesa._id}
            mesa={mesa}
            selectedMesa={selectedMesa}
            onMesaClick={handleMesaClick}
            actualizarMesas={actualizarMesas}
          />
        ))}
      </div>
    </div>
  );
};

export default MesaList;
