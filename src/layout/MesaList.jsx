import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import InfoMesa from "../components/infoMesa";
import Reloj from "../components/Reloj";
import axios from "axios";

const ItemTypes = {
  CLIENT: "client",
};

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const Mesa = ({ mesa, selectedMesa, onMesaClick }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CLIENT,
      canDrop: () => mesa.estado !== "Ocupado",
      drop: (item) => {
        // Manejar la lógica al soltar un cliente en la mesa
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [mesa]
  );

  const mesaBackgroundColor =
    mesa.estado === "Ocupado" ? "bg-red-300" : "bg-green-200";

  return (
    <div
      ref={drop}
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
          <p className={`${tipoCaja === 'Cerrada' ? 'bg-red-200' : 'bg-blue-200'} p-0.5 rounded-full font-bold italic`}>Caja {tipoCaja}</p>
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
            className={`py-2 px-2 md:px-4 rounded-lg transition-all duration-300 
              ${
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
          className={`py-2 px-4 rounded-lg transition-all duration-300 
            ${
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
          />
        ))}
      </div>
    </div>
  );
};

export default MesaList;
