import React, { useState } from 'react';
import MesaList from '../layout/MesaList';
import ClientList from '../layout/ClientList';
import Caja from '../components/Caja/Caja';

const Home = () => {
  const [clientes, setClientes] = useState('');

  const handleClienteDrop = (codigo) => {
    console.log('Cliente soltado:', codigo);
    // Elimina el cliente de la lista cuando se coloca en una mesa
    setClientes(prevClientes => prevClientes.filter(cliente => cliente.codigo !== codigo));
  };


  return (
    <div className='w-full'>
      <div className='relative z-50 '><ClientList onDropCliente={handleClienteDrop} /></div>
      <div className='ml-32 xl:ml-56 z-0 '>
        <Caja />
        <MesaList clientes={clientes} onClienteDrop={handleClienteDrop} />
      </div>
    </div>
  );
};

export default Home;
