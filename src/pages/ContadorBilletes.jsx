import React, { useState, useEffect, useRef } from 'react';
import convertirNumero from '../numberToWords.js';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import InvoiceCaja from '../components/InvoiceCaja.jsx';

function ContadorBilletes() {
  const toast = useRef(null);
  const backend = import.meta.env.VITE_BUSINESS_BACKEND;
  const [billetes, setBilletes] = useState({
    100000: 0,
    50000: 0,
    20000: 0,
    10000: 0,
    5000: 0,
    2000: 0,
    1000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0
  });

  const [tipoCaja, setTipoCaja] = useState(null);
  const [ultimoTotal, setUltimoTotal] = useState(null);
  const [ultimoTotalLetras, setUltimoTotalLetras] = useState(null);
  const [ultimoFecha, setUltimoFecha] = useState(null);
  const [idCaja, setIdCaja] = useState(null);
  const [imprimir, setImprimir] = useState(false);
  const [imprimirEnviada, setImprimirEnviada] = useState(false);

  const verificarEstadoCaja = async () => {
    try {
      const response = await fetch(`${backend}api/cajas`);
      if (!response.ok) throw new Error('Error al obtener el estado de la caja');

      const data = await response.json();
      const ultimoRegistro = data[data.length - 1];

      if (ultimoRegistro) {
        setTipoCaja(ultimoRegistro.tipoCaja === 'apertura' ? 'cierre' : 'apertura');
        setIdCaja(ultimoRegistro.id + 1);
        setUltimoTotal(ultimoRegistro.totalCaja);
        setUltimoTotalLetras(convertirNumero(ultimoRegistro.totalCaja));
        setUltimoFecha(ultimoRegistro.creado);

      } else {
        setTipoCaja('apertura');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al verificar el estado de la caja');
    }
  };

  useEffect(() => {
    verificarEstadoCaja();
  }, []);

  useEffect(() => {
    if (imprimir) {
      setImprimirEnviada(true);
    }
  }, [imprimir]);

  useEffect(() => {
    if (imprimirEnviada) {
      setImprimir(false);
      setImprimirEnviada(false);
    }
  }, [imprimirEnviada]);

  const handleChange = (denominacion, valor) => {
    setBilletes((prevBilletes) => ({
      ...prevBilletes,
      [denominacion]: parseInt(valor, 10) || 0
    }));
  };

  const mensaje = tipoCaja === 'apertura' ? 'Abrir Caja' : 'Cerrar Caja';

  const confirmarCaja = async () => {
    if (confirm('¿Estás seguro de realizar esta acción?')) {
      try {
        if (!tipoCaja) {
          alert('No se pudo determinar el tipo de caja');
          return;
        }
        // Obtener el último consecutivo
        const consecutivoResponse = await fetch(backend + 'api/cajas/ultimo-consecutivo'); // Ajusta la URL según tu API
        if (!consecutivoResponse.ok) {
          throw new Error('Error al obtener el último consecutivo');
        }

        const { consecutivo } = await consecutivoResponse.json();
        const nuevoConsecutivo = consecutivo + 1;

        const total = Object.keys(billetes).reduce(
          (acc, denom) => acc + billetes[denom] * denom,
          0
        );

        const response = await fetch(`${backend}api/cajas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            consecutivo: nuevoConsecutivo, 
            tipoCaja,
            tipoMoneda: Object.entries(billetes).map(([valor, cantidad]) => ({
              valor,
              cantidad
            })),
            totalCaja: total
          }),
        });

        if (!response.ok) {
          throw new Error('Error al registrar la caja');
        }

        const resultado = await response.json();
        toast.current.show({ severity: "success", summary: mensaje + ' realizado correctamente', life: 15000 });
        console.log('Resultado:', resultado);

        setImprimir(true);
        verificarEstadoCaja();
      } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al registrar la caja');
      }
    }
  };

  const total = Object.keys(billetes).reduce(
    (acc, denom) => acc + billetes[denom] * denom,
    0
  );

  const totalEnLetras = convertirNumero(total);

  const formatearFecha = () => {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="max-w-screen h-screen mx-auto p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className='grid grid-cols-3 gap-4'>
          <div className='col-span-2 px-4'>
            <div className="grid grid-cols-2 gap-4 border-4 p-4 rounded-xl">
              <h2 className='text-center col-span-2 text-2xl font-extrabold'>Contenido de la Caja</h2>
              {Object.keys(billetes)
                .sort((a, b) => b - a)
                .map((denominacion) => (
                  <div
                    key={denominacion}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 active:bg-gray-300 transition duration-150 border border-gray-300"
                  >
                    <label className="text-lg font-medium text-gray-700">
                      ${denominacion}
                    </label>
                    <input
                      type="number"
                      value={billetes[denominacion]}
                      onChange={(e) => handleChange(denominacion, e.target.value)}
                      className="w-20 p-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                      min="0"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col items-center ">
            <div className='bg-slate-100 border-4 rounded-xl p-2 w-full m-2 mb-4 space-y-2'>
              <h2 className='text-center font-bold text-lg italic bg-blue-100'>Datos {tipoCaja === 'apertura' ? 'Ultimo Cierre' : 'Ultima Apertura'} de Caja</h2>
              <div className='flex items-center justify-between font-semibold italic'>
                <span className='bg-blue-200 p-1 rounded-full'>Fecha</span>

              </div>
              <div className='flex items-center justify-between font-bold underline'>
                <span>{ultimoFecha}</span>
              </div>
              <div className='flex items-center justify-between font-bold'>
                <span className='italic bg-blue-200 p-1 rounded-full'>Total Caja</span>
                <span className='underline'>{ultimoTotal}</span>
              </div>
              <h2 className='w-full text-center font-bold p-2 bg-blue-200 italic'>
                Total en Letras: <span className='underline'>{ultimoTotalLetras}</span>
              </h2>
              <Button label={'Imprimir'} className='bg-green-400 p-2 font-bold border-4 flex items-center justify-center mx-auto rounded-xl hover:bg-green-500 ' />
            </div>
            <div className='w-full border-4 p-2'>
              <h1 className='text-center bg-green-200 font-bold text-2xl p-1 mb-2'>
                {tipoCaja === 'apertura' ? 'Apertura de la Caja' : 'Cierre de la Caja'}
              </h1>
              <h3 className='text-2xl font-semibold text-gray-800'>Caja Numero: #{idCaja}</h3>
              <p className="text-2xl font-semibold text-gray-800">Total: ${total}</p>
              <p className="text-lg font-medium text-gray-600 mt-2">
                ({totalEnLetras})
              </p>
              <p className='text-lg font-medium text-gray-600 mt-2 text-center'> Fecha y Hora de {tipoCaja === 'apertura' ? 'Apertura' : 'Cierre'}: {formatearFecha()}</p>

              <Button
                className="bg-red-400 p-2 border-4 rounded-xl flex items-center justify-center mx-auto font-extrabold text-lg hover:scale-105 hover:bg-red-500 mt-2"
                onClick={confirmarCaja}
                label={mensaje}
              />
            </div>
            {imprimirEnviada && (
              <InvoiceCaja
                billetes={billetes}
                mensaje={mensaje}
                total={total}
                imprimir={imprimirEnviada}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ContadorBilletes;
