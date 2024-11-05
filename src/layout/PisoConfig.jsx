import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateMesaModal from "../components/LocalConfig/UpdateCreateModalMesa";
import UpdatePisoModal from "../components/LocalConfig/UpdateCreateModalPiso"; // Asegúrate de crear este modal

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const PisoPage = () => {
  const [isMesaModalOpen, setIsMesaModalOpen] = useState(false);
  const [isPisoModalOpen, setIsPisoModalOpen] = useState(false);
  const [mesaToUpdate, setMesaToUpdate] = useState(null);
  const [pisoToUpdate, setPisoToUpdate] = useState(null);
  const [pisos, setPisos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPisos = async () => {
    try {
      const response = await axios.get(`${backend}api/pisos/local/${localId}?sort=nombre&order=asc`);
      setPisos(response.data);
    } catch (error) {
      console.error("Error al cargar los pisos:", error);
    }
  };

  const fetchMesas = async () => {
    try {
      const response = await axios.get(`${backend}api/mesas`);
      setMesas(response.data);
    } catch (error) {
      console.error("Error al cargar las mesas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPisos();
    fetchMesas();
  }, []);

  const handleOpenCreateMesaModal = () => {
    setMesaToUpdate(null);
    setIsMesaModalOpen(true);
  };

  const handleOpenUpdateMesaModal = (mesa) => {
    setMesaToUpdate(mesa);
    setIsMesaModalOpen(true);
  };

  const handleOpenCreatePisoModal = () => {
    setPisoToUpdate(null);
    setIsPisoModalOpen(true);
  };

  const handleOpenUpdatePisoModal = (piso) => {
    setPisoToUpdate(piso);
    setIsPisoModalOpen(true);
  };

  const handleSubmitMesa = async (mesaData) => {
    const mesaPayload = {
      nombre: mesaData.nombre,
      imagen: mesaData.imagen,
      piso: mesaData.piso,
    };

    try {
      if (mesaToUpdate) {
        await axios.put(`${backend}api/mesas/${mesaToUpdate._id}`, mesaPayload);
        alert("Mesa actualizada con éxito.");
      } else {
        await axios.post(`${backend}api/mesas`, mesaPayload);
        alert("Mesa creada con éxito.");
      }
      await fetchMesas();
      setIsMesaModalOpen(false);
    } catch (error) {
      console.error("Error al guardar la mesa:", error);
      alert("Error al guardar la mesa. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeleteMesa = async (mesaId) => {
    try {
      await axios.delete(`${backend}api/mesas/${mesaId}`);
      await fetchMesas();
    } catch (error) {
      console.error("Error al eliminar la mesa:", error);
    }
  };

  const handleSubmitPiso = async (pisoData) => {
    const pisoPayload = {
      nombre: pisoData.nombre,
      localId: localId,
    };

    try {
      if (pisoToUpdate) {
        await axios.put(`${backend}api/pisos/${pisoToUpdate._id}`, pisoPayload);
      } else {
        await axios.post(`${backend}api/pisos`, pisoPayload);
      }
      await fetchPisos();
      setIsPisoModalOpen(false);
    } catch (error) {
      console.error("Error al guardar el piso:", error);
    }
  };

  const handleDeletePiso = async (pisoId) => {
    try {
      if (confirm('¿Estas Seguro de Eliminar el Piso Seleccionado?. Las Mesas del Piso se Eliminaran del Mismo Modo')) {
        // Eliminar mesas asociadas al piso
        const mesasAsociadas = mesas.filter(mesa => mesa.piso._id === pisoId);
        await Promise.all(mesasAsociadas.map(mesa => axios.delete(`${backend}api/mesas/${mesa._id}`)));

        // Luego eliminar el piso
        await axios.delete(`${backend}api/pisos/${pisoId}`);
        await fetchPisos();
      }
    } catch (error) {
      console.error("Error al eliminar el piso:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Cargando mesas y pisos...</div>;
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Mesas y Pisos</h1>
      <div className="flex items-center justify-between p-4">

        <button
          onClick={handleOpenCreatePisoModal}
          className="bg-violet-500 text-white px-4 py-2 h-24 rounded-md mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex items-center mx-auto size-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="font-semibold text-lg">Crear Piso</span>
        </button>
        <button
          onClick={handleOpenCreateMesaModal}
          className="bg-green-500 text-white px-4 py-2 h-24 rounded-md mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex items-center mx-auto size-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="font-semibold text-lg">Crear Mesa</span>
        </button>
      </div>
      {pisos.map((piso) => (
        <div key={piso._id} className="mb-6 border rounded-lg shadow-md p-4 shadow-violet-500 group ">
          <h2 className="text-xl font-semibold mb-2">{piso.nombre}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mesas.filter(mesa => mesa.piso._id === piso._id).length > 0 ? (
              mesas.filter(mesa => mesa.piso._id === piso._id).map((mesa) => (
                <div key={mesa._id} className="border-4 rounded-xl m-2 p-4 flex flex-col items-center transition duration-300 ease-in-out group-hover:bg-gray-300 hover:shadow-lg">
                  <img src={mesa.imagen} alt={mesa.nombre} className="flex items-center justify-center w-auto h-32 object-cover mb-2" />
                  <span className="font-semibold capitalize">{mesa.nombre}</span>
                  <div className="flex justify-between w-full mt-2">
                    <button
                      onClick={() => handleOpenUpdateMesaModal(mesa)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md transition duration-300 ease-in-out hover:bg-yellow-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>

                    </button>
                    <button
                      onClick={() => handleDeleteMesa(mesa._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md transition duration-300 ease-in-out hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>

                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay mesas en este piso.</p>
            )}
          </div>
          <div className="mt-4 flex items-center justify-center space-x-12">
            <button
              onClick={() => handleOpenUpdatePisoModal(piso)}
              className="bg-yellow-600 text-white px-2 py-1 h-20 w-28  mr-2 transition duration-300 ease-in-out hover:bg-yellow-700 rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex justify-center mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>

              <span className="font-semibold">Editar Piso</span>
            </button>
            <button
              onClick={() => handleDeletePiso(piso._id)}
              className="bg-red-500 text-white px-2 py-1 h-20 w-28  transition duration-300 ease-in-out hover:bg-red-600 rounded-xl font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex justify-center mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>

              Eliminar Piso
            </button>
          </div>
        </div>

      ))}

      <UpdateMesaModal
        isOpen={isMesaModalOpen}
        onClose={() => setIsMesaModalOpen(false)}
        onSubmit={handleSubmitMesa}
        mesa={mesaToUpdate}
        pisos={pisos}
      />

      <UpdatePisoModal
        isOpen={isPisoModalOpen}
        onClose={() => setIsPisoModalOpen(false)}
        onSubmit={handleSubmitPiso}
        piso={pisoToUpdate}
      />
    </div>
  );
};

export default PisoPage;
