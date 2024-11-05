import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

const tipoNegocio = import.meta.env.VITE_BUSINESS_TYPE;
const nombreNegocio = import.meta.env.VITE_BUSINESS_NAME;
const logoNegocio = import.meta.env.VITE_BUSINESS_IMAGE;
const direccionNegocio = import.meta.env.VITE_BUSINESS_ADDRESS;
const telefonoNegocio = import.meta.env.VITE_BUSINESS_CELLPHONE;

const InvoiceVentas = ({ ventasData, imprimir }) => {
  const componentRef = useRef();

  // Obtener la fecha actual
  const fechaActual = new Date().toLocaleDateString();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
        @page {
            size: 58mm auto;
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
                height: 100vh;
            }
        }
        `,
  });

  useEffect(() => {
    if (imprimir) {
      handlePrint();
    }
  }, [imprimir]);

  return (
    <div>
      <div ref={componentRef} className="w-48 p-2 text-xs">
        <div className="flex flex-col items-center justify-center">
          <img
            src={logoNegocio}
            className="w-auto h-12"
            alt="Logo de la empresa"
          />
          <p>
            {tipoNegocio}:{" "}
            <span className="px-2 italic font-semibold">{nombreNegocio}</span>
          </p>
        </div>

        <div className="flex items-center justify-evenly my-2">
          <span className="font-bold">Resumen de Ventas</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Última Apertura:</span>
          <span className="font-bold">
            {ventasData.ultimaApertura || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Fecha de impresión:</span>
          <span className="font-bold">{fechaActual}</span>
        </div>

        <hr className="border-dashed my-2" />

        <ul className="list-disc">
          <li className="flex justify-between mb-2">
            <span>Total Ventas:</span>
            <span className="font-bold">${ventasData.totalVentas || "0"}</span>
          </li>
          <li className="flex justify-between mb-2">
            <span>Total Gastos:</span>
            <span className="font-bold">${ventasData.totalGastos || "0"}</span>
          </li>

          <li className="flex justify-between mb-2">
            <span>Clientes Hoy:</span>
            <span className="font-bold">{ventasData.clientesHoy || "0"}</span>
          </li>
          <li className="flex justify-between mb-2">
            <span>Pagos Hoy:</span>
            <span className="font-bold">{ventasData.pagosHoy || "0"}</span>
          </li>
        </ul>

        <hr className="border-dashed my-2" />

        <div className="grid grid-cols-3 gap-2 mb-2">
          <span className="w-full font-semibold">Dirección:</span>
          <span className="col-span-2">{direccionNegocio}</span>
          <span className="w-full font-semibold">Teléfono:</span>
          <span className="col-span-2">{telefonoNegocio}</span>
        </div>
        <h3 className="text-center mt-4">Piedecuesta</h3>

        <p className="text-center font-light">Gracias Por Tu Compra :3</p>
      </div>
    </div>
  );
};

export default InvoiceVentas;
