import React, { useState, useEffect, useRef } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import ButtonCalculator from "./ButtonCalculator";
import InvoiceDetail from "../InvoiceDetail";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;

const CalculatorPanel = ({ clientData }) => {
  console.log(clientData);
  const [costTotal, setCostTotal] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [change, setChange] = useState("");
  const [activeInput, setActiveInput] = useState("costTotal");
  const [showConfirm, setShowConfirm] = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const toastBC = useRef(null);

  useEffect(() => {
    if (clientData && clientData.productos) {
      const total = clientData.productos.reduce(
        (acc, producto) => acc + producto.valorTotal,
        0
      );
      setCostTotal(total);
    }
  }, [clientData]);

  useEffect(() => {
    calculateChange();
  }, [costTotal, receivedAmount]);

  const calculateChange = () => {
    const total = parseFloat(costTotal) || 0;
    const received = parseFloat(receivedAmount) || 0;
    setChange(received - total);
  };

  const handleButtonClick = (value) => {
    if (activeInput === "costTotal") {
      setCostTotal((prev) => prev + value);
    } else if (activeInput === "receivedAmount") {
      setReceivedAmount((prev) => prev + value);
    } else if (activeInput === "discountPercentage") {
      setDiscountPercentage((prev) => prev + value);
    }
  };

  const clearInputs = () => {
    setCostTotal(
      clientData.productos.reduce(
        (acc, producto) => acc + producto.valorTotal,
        0
      )
    );
    setReceivedAmount("");
    setChange("");
    setApplyDiscount(false);
    setDiscountPercentage("");
  };

  const handlePurchase = () => {
    if (
      !costTotal ||
      !receivedAmount ||
      parseFloat(receivedAmount) < parseFloat(costTotal)
    ) {
      toastBC.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "Por favor verifica que todos los campos estén llenos y que el monto recibido sea mayor o igual al costo total.",
        life: 3000,
      });
      return;
    }
    setShowConfirm(true);
  };

  const confirmPurchase = async () => {
    try {
      // Obtener el último consecutivo
      const consecutivoResponse = await fetch(
        backend + "api/pagos/ultimo-consecutivo"
      );
      if (!consecutivoResponse.ok) {
        throw new Error("Error al obtener el último consecutivo");
      }

      const { consecutivo } = await consecutivoResponse.json();
      const nuevoConsecutivo = consecutivo + 1;

      // Crear el pago
      const response = await fetch(backend + "api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consecutivo: nuevoConsecutivo,
          nombre: clientData.nombre || "Cliente Recurrente",
          productos: clientData.productos.map((producto) => ({
            productoId: producto.productoId._id,
            nombreProducto: producto.nombreProducto,
            cantidad: producto.cantidad,
            valorTotal: producto.valorTotal,
          })),
          valorTotal: costTotal,
          localId: clientData.localId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar el pago");
      }

      toastBC.current.show({
        severity: "success",
        summary: "Compra efectuada",
        detail: "La compra se ha efectuado con éxito.",
        life: 10000,
      });

      // Llamar a la función para eliminar el cliente
      await deleteClient();

      clearInputs();
      setShowConfirm(false);
      setButtonDisabled(true);
    } catch (error) {
      toastBC.current.show({
        severity: "error",
        summary: "Error",
        detail: `Ocurrió un error: ${error.message}`,
        life: 10000,
      });
    }
  };

  const deleteClient = async () => {
    try {
      const response = await fetch(`${backend}api/clientes/${clientData._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el cliente");
      }

      toastBC.current.show({
        severity: "success",
        summary: "Cliente Eliminado",
        detail: "El cliente ha sido eliminado con éxito.",
        life: 5000,
      });

      // Aquí puedes agregar cualquier acción adicional, como redirigir al usuario o actualizar el estado
    } catch (error) {
      toastBC.current.show({
        severity: "error",
        summary: "Error",
        detail: `Ocurrió un error al eliminar el cliente: ${error.message}`,
        life: 5000,
      });
    }
  };

  const cancelPurchase = () => {
    setShowConfirm(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "costTotal") {
      setCostTotal(value);
    } else if (id === "receivedAmount") {
      setReceivedAmount(value);
    } else if (id === "discountPercentage") {
      setDiscountPercentage(value);
    }
  };

  return (
    <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
      <div className="flex flex-col w-full items-center justify-center col-span-2 xl:col-span-3 mx-auto border-4">
        <Toast ref={toastBC} />
        <Dialog
          header="Confirmación de Compra"
          visible={showConfirm}
          style={{ width: "50vw" }}
          footer={
            <div className="font-bold">
              <Button
                className="bg-blue-200 border-2 rounded-xl border-gray-500 mx-4 my-2 p-2"
                label="Sí"
                icon="pi pi-check"
                onClick={confirmPurchase}
              />
              <Button
                label="No"
                icon="pi pi-times"
                className="p-button-secondary bg-red-200 border-2 rounded-xl border-gray-500 p-2 my-2"
                onClick={cancelPurchase}
              />
            </div>
          }
          onHide={() => setShowConfirm(false)}
        >
          <p>¿Deseas efectuar la compra?</p>
        </Dialog>

        {/* Sección de detalles del costo */}
        <div className="w-full rounded-xl p-4">
          <div className="">
            <div className="grid grid-cols-3 gap-6">
              {/* Costo Total */}
              <div className="text-center col-span-2">
                <input
                  id="costTotal"
                  type="text"
                  className="w-full text-xl font-bold p-4 border-4 bg-blue-100 border-blue-300 cursor-pointer"
                  placeholder="Costo Total"
                  value={costTotal}
                  onClick={() => setActiveInput("costTotal")}
                  onChange={handleInputChange}
                />
              </div>

              {/* Porcentaje de Descuento */}
              {applyDiscount && (
                <div className="text-center w-full">
                  <input
                    id="discountPercentage"
                    type="number"
                    className="w-full text-xl font-bold p-4 border-4 bg-yellow-100 border-yellow-300"
                    placeholder="Descuento (%)"
                    value={discountPercentage}
                    onClick={() => setActiveInput("discountPercentage")}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>

            {/* Checkbox de Descuento */}
            <div className="flex items-center justify-center mx-auto m-4 gap-2">
              <input
                className=""
                type="checkbox"
                id="applyDiscount"
                checked={applyDiscount}
                onChange={(e) => setApplyDiscount(e.target.checked)}
              />
              <label htmlFor="applyDiscount" className="font-semibold text-lg">
                Aplicar Descuento
              </label>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {/* Monto Recibido */}
            <div className="text-center">
              <input
                id="receivedAmount"
                type="text"
                className="w-full text-xl font-bold p-4 border-4 bg-green-100 border-green-300"
                placeholder="Recibe"
                value={receivedAmount}
                onClick={() => setActiveInput("receivedAmount")}
                onChange={handleInputChange}
                autoComplete="OFF"
              />
            </div>

            {/* Monto Cambio */}
            <div className="text-center">
              <input
                id="change"
                type="text"
                className="w-full text-xl font-bold p-4 border-4 bg-red-100 border-red-300"
                placeholder="Cambio"
                value={change}
                readOnly
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 mx-auto">
              {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0, "00", "."].map((value) => (
                <ButtonCalculator
                  key={value}
                  value={value}
                  onClick={() => handleButtonClick(value)}
                />
              ))}
            </div>

            {/* Botones de acciones */}
            <div className="grid grid-cols-2 gap-16 my-4">
              <button
                className="bg-red-400 text-white rounded-xl border-4 px-4 py-2 font-bold hover:scale-105 active:bg-red-500"
                onClick={clearInputs}
              >
                Limpiar
              </button>
              <Button
                className={`bg-green-500 text-white rounded-xl border-4 px-4 py-2 font-bold hover:scale-105 active:bg-green-600`}
                onClick={handlePurchase}
                disabled={buttonDisabled}
                label={"Aceptar"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <InvoiceDetail
          clientData={clientData}
          recibe={receivedAmount}
          cambio={change}
          total={costTotal ? costTotal : "0"}
        />
      </div>
    </div>
  );
};

export default CalculatorPanel;
