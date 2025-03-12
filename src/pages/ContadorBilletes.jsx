import React, { useState, useEffect, useRef } from "react";
import convertirNumero from "../numberToWords.js";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import InvoiceCaja from "../components/InvoiceCaja.jsx";

function ContadorBilletes() {
  const toast = useRef(null);
  const backend = import.meta.env.VITE_BUSINESS_BACKEND;
  const localId = localStorage.getItem("localId");

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
    50: 0,
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
      const response = await fetch(
        `${backend}api/cajas/ultima-caja/${localId}`
      );
      if (!response.ok)
        throw new Error("Error al obtener el estado de la caja");

      const data = await response.json();
      console.table(data);
      const ultimoRegistro = data.ultimaCaja;

      if (ultimoRegistro) {
        setTipoCaja(
          ultimoRegistro.tipoCaja === "apertura" ? "cierre" : "apertura"
        );
        setIdCaja(ultimoRegistro.consecutivo + 1);
        setUltimoTotal(ultimoRegistro.totalCaja);
        setUltimoTotalLetras(convertirNumero(ultimoRegistro.totalCaja));
        setUltimoFecha(ultimoRegistro.creado);
        console.log(tipoCaja);
      } else {
        setTipoCaja("apertura");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al verificar el estado de la caja");
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
      [denominacion]: parseInt(valor, 10) || 0,
    }));
  };

  const mensaje = tipoCaja === "apertura" ? "Abrir Caja" : "Cerrar Caja";

  const confirmarCaja = async () => {
    // Confirma si el usuario quiere realizar la acción
    if (confirm("¿Estás seguro de realizar esta acción?")) {
      try {
        // Verificar si se ha seleccionado el tipo de caja
        if (!tipoCaja) {
          alert("No se pudo determinar el tipo de caja");
          return;
        }

        // Obtener el último consecutivo para el local
        console.log("Solicitando el último consecutivo para el local", localId); // Depuración
        const consecutivoResponse = await fetch(
          `${backend}api/cajas/ultima-caja/${localId}`
        ); // Ajusta la URL según tu API

        // Si la respuesta no es correcta, lanzar un error
        if (!consecutivoResponse.ok) {
          throw new Error("Error al obtener el último consecutivo");
        }

        // Obtener el consecutivo de la respuesta
        const { ultimaCaja } = await consecutivoResponse.json();
        console.log("Última caja obtenida:", ultimaCaja); // Depuración

        // Si no hay una caja previa, el consecutivo debe empezar en 1
        const nuevoConsecutivo = ultimaCaja ? ultimaCaja.consecutivo + 1 : 1;
        console.log("Nuevo consecutivo calculado:", nuevoConsecutivo); // Depuración

        // Calcular el total de la caja sumando los valores de los billetes
        const total = Object.keys(billetes).reduce(
          (acc, denom) => acc + billetes[denom] * denom,
          0
        );
        console.log("Total calculado:", total); // Depuración

        // Hacer la solicitud para registrar la nueva caja
        const response = await fetch(`${backend}api/cajas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            consecutivo: nuevoConsecutivo, // Nuevo consecutivo
            tipoCaja, // Tipo de caja
            tipoMoneda: Object.entries(billetes).map(([valor, cantidad]) => ({
              valor,
              cantidad,
            })), // Convertir billetes a formato adecuado
            totalCaja: total, // Total de la caja
            localId: localId, // ID del local
          }),
        });

        // Verificar que la solicitud fue exitosa
        if (!response.ok) {
          throw new Error("Error al registrar la caja");
        }

        // Mostrar el resultado de la operación
        const resultado = await response.json();
        console.log("Resultado de la creación de la caja:", resultado); // Depuración

        // Mostrar mensaje de éxito
        toast.current.show({
          severity: "success",
          summary: mensaje + " realizado correctamente",
          life: 15000,
        });

        // Establecer que se debe imprimir
        setImprimir(true);

        // Verificar el estado de la caja
        verificarEstadoCaja();
      } catch (error) {
        // Si ocurre un error, mostrar un mensaje de error
        console.error("Error:", error);
        alert("Ocurrió un error al registrar la caja");
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
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    const segundos = String(fecha.getSeconds()).padStart(2, "0");
    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="max-w-screen h-screen mx-auto p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 px-4">
            <div className="grid grid-cols-2 gap-4 border-4 p-4 rounded-xl">
              <h2 className="text-center col-span-2 text-2xl font-extrabold">
                Contenido de la Caja
              </h2>
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
                      onChange={(e) =>
                        handleChange(denominacion, e.target.value)
                      }
                      className="w-20 p-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                      min="0"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col items-center ">
            <div className="bg-white border-4 rounded-xl p-6 w-full m-4 mb-6 shadow-lg space-y-6">
              <h2 className="text-center font-bold text-2xl text-blue-700 italic bg-blue-100 py-4 rounded-md">
                {`Datos ${
                  tipoCaja === "apertura" ? "Último Cierre" : "Última Apertura"
                } de Caja`}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fecha */}
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-xl shadow-md">
                  <span className="text-sm font-semibold text-gray-600 bg-blue-200 p-2 rounded-full">
                    Fecha
                  </span>
                  <span className="font-bold text-lg text-blue-600 mt-2">
                    {formatearFecha()}
                  </span>
                </div>

                {/* Total Caja */}
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-xl shadow-md">
                  <span className="text-sm font-semibold text-gray-600 bg-blue-200 p-2 rounded-full">
                    Total Caja
                  </span>
                  <span className="font-bold text-lg text-green-600 mt-2">
                    {ultimoTotal}
                  </span>
                </div>
              </div>

              {/* Total en Letras */}
              <div className="w-full text-center font-bold p-4 bg-blue-200 rounded-lg shadow-md">
                <span>Total en Letras: </span>
                <span className="underline">{ultimoTotalLetras} pesos</span>
              </div>

              {/* Botón Imprimir */}
              <Button
                label={"Imprimir"}
                className="bg-green-400 p-3 font-bold border-4 flex items-center justify-center mx-auto rounded-xl hover:bg-green-500 text-white shadow-md mt-6"
              />
            </div>

            <div className="w-full max-w-xl mx-auto bg-white border-4 rounded-xl p-6 shadow-xl space-y-6">
              <h1 className="text-center bg-green-200 font-bold text-2xl py-3 rounded-lg text-green-700">
                {tipoCaja === "apertura"
                  ? "Apertura de la Caja"
                  : "Cierre de la Caja"}
              </h1>

              <div className="space-y-2">
                {/* Caja Numero */}
                <h3 className="text-2xl font-semibold text-gray-800 text-center">
                  Caja Número: #{idCaja}
                </h3>

                {/* Total */}
                <p className="text-2xl font-semibold text-gray-800 text-center">
                  Total: <span className="text-green-600">${total}</span>
                </p>

                {/* Total en Letras */}
                <p className="text-lg font-medium text-gray-600 text-center">
                  ({totalEnLetras})
                </p>

                {/* Fecha y Hora */}
                <p className="text-lg font-medium text-gray-600 mt-2 text-center">
                  Fecha y Hora de{" "}
                  {tipoCaja === "apertura" ? "Apertura" : "Cierre"}:{" "}
                  <span className="text-blue-600">{formatearFecha()}</span>
                </p>
              </div>

              {/* Botón Confirmar */}
              <Button
                className="bg-red-400 p-3 border-4 rounded-xl flex items-center justify-center mx-auto font-extrabold text-lg text-white hover:scale-105 hover:bg-red-500 mt-4 shadow-md"
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
