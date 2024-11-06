import React, { useState, useMemo, useRef, useEffect } from 'react';
import Client from '../../assets/client.png';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import ButtonPayment from '../Cliente/ButtonPayment';

const NuevoClienteAside = ({ isEdit, clientData, productos }) => {
  const backend = import.meta.env.VITE_BUSINESS_BACKEND;
  const localId = localStorage.getItem("localId");

  console.table(productos);

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [savedClient, setSavedClient] = useState(null);
  const [clientName, setClientName] = useState(''); // Estado para el nombre del cliente
  const toast = useRef(null);

  const hasNonOneQuantity = Object.values(productos).some(({ cantidad }) => cantidad > 0);
  const buttonClass = hasNonOneQuantity ? 'block' : 'hidden';

  const calculateTotal = () => {
    return Object.entries(productos).reduce((acc, [id, { cantidad }]) => {
      const precio = productos[id]?.precio || 0; // Accede al precio directamente
      return acc + (cantidad * precio);
    }, 0);
  };

  const total = useMemo(() => calculateTotal(), [productos]);

  const createOrUpdateClient = async () => {
    const cliente = {
      nombre: clientName, // Usamos el nombre ingresado en el input
      productos: Object.entries(productos).flatMap(([id, { nombre, cantidad }]) => 
        cantidad > 0 ? [{
          productoId: id,
          nombreProducto: nombre, 
          cantidad,
          valorTotal: productos[id]?.precio * cantidad
        }] : []
      ),
      localId: localId,
      creado: new Date(),
    };

    try {
      let response;

      // Verificamos si `clientData` tiene tipoCliente
      if (clientData?.tipoCliente) {
        if (clientData.tipoCliente === "Mesa") {
          // Si el cliente es de tipo "Mesa", actualizamos la mesa
          response = await fetch(`${backend}api/mesas/${clientData._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...clientData, // Mantener los datos existentes de la mesa
              productos: cliente.productos // Actualizamos los productos
            })
          });

          if (response.ok) {
            const updatedMesa = await response.json();
            setSavedClient(updatedMesa);
            toast.current.show({ severity: 'success', summary: 'Mesa Actualizada', detail: 'La mesa ha sido actualizada exitosamente', life: 3000 });
          } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la mesa', life: 3000 });
          }
        } else if (clientData.tipoCliente === "Cliente") {
          // Si el cliente es de tipo "Cliente", actualizamos el cliente
          response = await fetch(`${backend}api/clientes/${clientData._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...clientData, // Mantener los datos existentes del cliente
              productos: cliente.productos // Actualizamos los productos
            })
          });

          if (response.ok) {
            const updatedClient = await response.json();
            setSavedClient(updatedClient);
            toast.current.show({ severity: 'success', summary: 'Cliente Actualizado', detail: 'El cliente ha sido actualizado exitosamente', life: 3000 });
          } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el cliente', life: 3000 });
          }
        }
      } else {
        // Si no hay `clientData`, creamos un nuevo cliente
        response = await fetch(`${backend}api/clientes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cliente)
        });

        if (response.ok) {
          const newClient = await response.json();
          setSavedClient(newClient);
          toast.current.show({ severity: 'success', summary: 'Cliente Creado', detail: `Cliente ${newClient.nombre ? newClient.nombre : 'Exitosamente'} creado`, life: 3000 });
        } else {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el cliente', life: 3000 });
        }
      }
      setClientName(''); // Reinicia el input
      setButtonDisabled(true); // Deshabilita el botón después de la operación
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error en la conexión', life: 3000 });
      console.error('Error al crear/actualizar cliente:', error);
    }
  };

  useEffect(() => {
    if (savedClient) {
      console.log("Efectuando pago automáticamente con el cliente:", savedClient);
    }
  }, [savedClient]);

  return (
    <>
      <Toast ref={toast} />
      <aside className='fixed h-full w-40 md:w-56 bg-white border-r-4 flex flex-col items-center justify-start overflow-auto'>
        <h1 className='w-full text-center mt-4 font-bold bg-red-100'>
          {isEdit ? 'Editar Cliente' : 'Cliente Nuevo'}
        </h1>
        <img src={Client} alt="client" className='mx-auto my-4' />

        {/* Input para el nombre del cliente */}
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Cliente o Empresa"
          className="w-48 p-2 border-2 border-gray-400 rounded mb-4 px-2 text-center"
        />

        <h2 className="text-base md:text-lg font-bold mb-4">Selección:</h2>
        <ul className="text-sm md:text-base w-full px-1 md:px-4">
          {Object.entries(productos).map(([id, { nombre, cantidad }]) => (
            cantidad > 0 && (
              <li key={id} className="flex justify-between items-center mb-2">
                <span className="font-semibold ">{nombre}</span>
                <span className="text-nowrap bg-green-300 p-1 font-bold">
                  {cantidad} x ${productos[id]?.precio || 0}
                </span>
              </li>
            )
          ))}
        </ul>

        <div className="w-full px-4 mb-2">
          <hr className="my-2" />
          <div className="flex justify-between items-center font-bold text-base md:text-xl">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="w-full mt-auto mb-8">
          {savedClient && <ButtonPayment cliente={savedClient} />}
        </div>

        <div className={`${buttonClass} w-full mb-20`}>
          <Button
            id='buttonAction'
            label={isEdit ? "Actualizar Cliente" : "Crear Cliente"}
            onClick={createOrUpdateClient}
            disabled={buttonDisabled}
            className={`${buttonClass} p-button-success px-4 py-2 rounded-xl border-2 flex items-center justify-center mx-auto bg-blue-500 text-white`}
          />
        </div>
      </aside>
    </>
  );
};

export default NuevoClienteAside;
