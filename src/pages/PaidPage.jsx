import React, { useState, useEffect } from 'react';
import Client from '../assets/client.png';
import { useLocation } from 'react-router-dom';
import CalculatorPanel from '../components/Cliente/Calculadora';

const PaidPage = () => {
  const location = useLocation();
  const { clientData } = location.state || {};
  const [clientDetails, setClientDetails] = useState(null);
  const backend = import.meta.env.VITE_BUSINESS_BACKEND;

  useEffect(() => {
    const fetchClientData = async () => {
      if (clientData && clientData._id) {
        try {
          // Verificamos si el cliente es de tipo "Mesa" o "Individual"
          const apiEndpoint = clientData.tipoCliente === 'Mesa'
            ? `${backend}api/mesas/${clientData._id}`  // API de mesas
            : `${backend}api/clientes/${clientData._id}`; // API de clientes

          const response = await fetch(apiEndpoint);
          if (response.ok) {
            const data = await response.json();
            setClientDetails(data);
          } else {
            console.error('Error fetching client data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching client data:', error);
        }
      }
    };

    fetchClientData();
  }, [clientData, backend]);

  return (
    <>
      <aside className='fixed h-full w-56 -mt-4 bg-white border-r-4 flex flex-col items-center justify-start overflow-auto'>
        <h1 className='w-full text-center mt-4 font-bold bg-red-100'>
          Cliente Pagando
        </h1>
        <img src={Client} alt="client" className='mx-auto my-4' />
        <h2 className="text-lg font-bold mb-4">Selección:</h2>
        <ul className="w-full px-4">
          {clientDetails && clientDetails.productos && clientDetails.productos.length > 0 ? (
            clientDetails.productos.map((producto) => (
              <li key={producto._id} className="flex justify-between items-center mb-2">
                <span className="font-semibold text-base">{producto.productoId.nombre}</span>
                <span className="text-nowrap bg-green-300 p-1 font-bold">
                  {producto.cantidad} x ${producto.productoId.precio}
                </span>
              </li>
            ))
          ) : (
            <li>No hay productos seleccionados</li>
          )}
        </ul>
        <div className="w-full px-4 mb-2">
          <hr className="my-2" />
          <div className="flex justify-between items-center font-bold text-xl">
            <span>Total:</span>
            <span>
              ${clientDetails?.productos.reduce((acc, producto) => acc + producto.valorTotal, 0)}
            </span>
          </div>
        </div>
      </aside>

      <section className='ml-60 px-1 xl:px-4'>
        {clientDetails && <CalculatorPanel clientData={clientDetails} />}
      </section>
    </>
  );
};

export default PaidPage;
