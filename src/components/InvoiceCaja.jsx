import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const tipoNegocio = import.meta.env.VITE_BUSINESS_TYPE;
const nombreNegocio = import.meta.env.VITE_BUSINESS_NAME;
const logoNegocio = import.meta.env.VITE_BUSINESS_IMAGE;
const direccionNegocio = import.meta.env.VITE_BUSINESS_ADDRESS;
const telefonoNegocio = import.meta.env.VITE_BUSINESS_CELLPHONE;

const InvoiceCaja = ({ billetes, mensaje, total, imprimir }) => {
    console.log(billetes,mensaje,total,imprimir)
    const componentRef = useRef();

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

      const calcularTotalDenominacion = (denominacion, cantidad) => {
        return denominacion * cantidad;
      };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                size: 58mm auto; /* Cambia a 80mm si tu impresora es de 80mm */
                margin: 0;
            }
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                }
                .print-content {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh; /* Ajusta según sea necesario */
                }
            }
        `,
    });

    // Llama a handlePrint si imprimir es verdadero
    React.useEffect(() => {
        if (imprimir) {
            handlePrint();
        }
    }, [imprimir, handlePrint]);

    return (
        <div ref={componentRef} className=' w-48 mx-auto p-2 text-xs'>
            <div className='flex flex-col items-center justify-center'>
                <img src={logoNegocio} className='w-auto h-12' alt="Logo de la empresa" />
                <p>{tipoNegocio}:<span className='px-2 italic font-semibold'>{nombreNegocio}</span></p>
            </div>
            <div className='flex items-center justify-evenly my-2'>
                <span>Tipo de Factura:</span>
                <span className='underline'>Informe de {mensaje}</span>
            </div>
            <div className='flex items-center justify-between'>
                <span>Fecha:</span>
                <span className=''>{formatearFecha()}</span>
            </div>
            <hr className='border-dashed my-2' />

            <ul className='list-disc'>
                <li className='grid grid-cols-5 gap-2 font-semibold mb-2'>
                    <span className='col-span-3'>Moneda</span>
                    <span className='text-center'>Cant</span>
                    <span className='text-center'>Total</span>
                </li>
                {Object.keys(billetes).map((denominacion) => {
                    const cantidad = billetes[denominacion];
                    const totalDenominacion = calcularTotalDenominacion(parseInt(denominacion, 10), cantidad);
                    return (
                        <li key={denominacion} className='grid grid-cols-5 gap-2 mb-1'>
                            <span className='col-span-3'>{denominacion}</span>
                            <span className='text-center'>{cantidad}</span>
                            <span className='text-center'>{totalDenominacion}</span>
                        </li>
                    );
                })}
                <li className='grid grid-cols-5 gap-2 font-semibold mt-2'>
                    <span className='col-span-3'>Total</span>
                    <span className='text-center'></span>
                    <span className='text-center'>{total}</span>
                </li>
            </ul>
            <hr className='border-dashed my-2' />

            <ul>
                <li className='grid grid-cols-5 gap-2'>
                    <span className='col-span-4 font-bold'>Total en Caja:</span>
                    <span className='w-full text-center font-bold'>{total}</span>
                </li>
            </ul>

            <hr className='border-dashed my-2' />

            <div className='grid grid-cols-3 gap-2 mb-2'>
                <span className='w-full font-semibold'>Dirección:</span>
                <span className='col-span-2'>{direccionNegocio}</span>
                <span className='w-full font-semibold'>Teléfono:</span>
                <span className='col-span-2'>{telefonoNegocio}</span>
            </div>
            <h3 className='text-center mt-4'>Piedecuesta</h3>

            <p className='text-center font-light'>Informe de Caja :3</p>
        </div>
    );
};

export default InvoiceCaja;
