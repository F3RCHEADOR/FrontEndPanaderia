import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import ClientInfo from '../components/Home/infoClient';
import clienteImagen from "../assets/client.png";
import axios from 'axios';

const backend = import.meta.env.VITE_BUSINESS_BACKEND;
const localId = localStorage.getItem("localId");

const ItemTypes = {
  CLIENT: 'client',
};

const Client = ({ cliente, selectedCliente, onClientClick, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CLIENT,
    item: cliente,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [cliente]);

  return (
    <div
      ref={drag}
      className={` p-2 md:p-4 w-auto md:w-28 h-auto md:h-32 z-0 font-bold text-gray-700 cursor-pointer bg-white shadow-md rounded mx-auto transition-all ${isDragging ? 'opacity-50' : ''}`}
    >
      <button onClick={() => onClientClick(cliente._id)}>
        <img src={clienteImagen} alt={cliente.codigo} className="w-20 mx-auto transition-all" />
      </button>
      <h2 className="text-base font-semibold mb-2 text-center">{cliente.nombre ? cliente.nombre : 'Cliente'}</h2>

      {selectedCliente === cliente._id && (
        <ClientInfo
          cliente={cliente}
          onClose={() => onClientClick(null)}
          onDelete={onDelete} 
        />
      )}
    </div>
  );
};

const ClientList = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${backend}api/clientes/local/${localId}`);
        setClientes(response.data);
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleClientClick = (id) => {
    setSelectedCliente(selectedCliente === id ? null : id);
  };

  const handleDeleteClient = async (clientId) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar este cliente?`);
    if (confirmDelete) {
      try {
        await axios.delete(`${backend}api/clientes/${clientId}`);
        setClientes(clientes.filter(cliente => cliente._id !== clientId)); // Actualizar la lista de clientes
        alert('Cliente eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        alert('Hubo un problema al eliminar el cliente');
      }
    }
  };

  return (
    <div className="fixed overflow-auto p-4 xl:p-6  xl:min-h-screen border-r-4 w-32 xl:w-56">
      <h1 className="text-2xl font-bold mb-6 text-center">Clientes</h1>
      <div className="space-y-8 mt-12">
        {clientes.map((cliente) => (
          <Client
            key={cliente._id}
            cliente={cliente}
            selectedCliente={selectedCliente}
            onClientClick={handleClientClick}
            onDelete={handleDeleteClient} 
          />
        ))}
      </div>
    </div>
  );
};

export default ClientList;
