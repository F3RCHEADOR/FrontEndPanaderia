import React, { useState, useEffect } from 'react';
import InvoiceInventory from './InvoiceInventory'; // Asegúrate de que la ruta sea correcta

const backend = import.meta.env.VITE_BUSINESS_BACKEND;

function FormInventories() {
    const [fields, setFields] = useState([{ id: 0, nombreProducto: '', cantidad: '', costo: '', costoIVA: '' }]);
    const [nextId, setNextId] = useState(1);
    const [addTax, setAddTax] = useState(false);
    const [empresa, setEmpresa] = useState('');
    const [costoTotal, setCostoTotal] = useState(0);
    const [imprimir, setImprimir] = useState(false); // Estado para controlar la impresión
    const [invoiceData, setInvoiceData] = useState({ productos: [], mensaje: '', total: 0 }); // Datos para la factura

    const addField = () => {
        setFields([...fields, { id: nextId, nombreProducto: '', cantidad: '', costo: '', costoIVA: '' }]);
        setNextId(nextId + 1);
    };

    const removeField = (id) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const calculateTotal = () => {
        const total = fields.reduce((sum, field) => {
            const costo = parseFloat(field.costo) || 0;
            const costoConIva = parseFloat(field.costoIVA) || 0;
            return sum + (addTax ? costoConIva : costo);
        }, 0);
        setCostoTotal(total);
    };

    const handleChange = (id, e) => {
        const { name, value } = e.target;
        setFields(fields.map(field => {
            if (field.id === id) {
                let updatedField = { ...field, [name]: value };

                if (addTax && name === 'costo') {
                    const costoValue = parseFloat(value) || 0;
                    const iva = costoValue * 0.19;
                    updatedField.costoIVA = (costoValue + iva).toFixed(2);
                } else if (name === 'costo') {
                    updatedField.costoIVA = '';
                }

                return updatedField;
            }
            return field;
        }));
    };

    const handleTaxChange = (e) => {
        const checked = e.target.checked;
        setAddTax(checked);

        setFields(fields.map(field => {
            if (checked) {
                const costoValue = parseFloat(field.costo) || 0;
                const iva = costoValue * 0.19;
                return { ...field, costoIVA: (costoValue + iva).toFixed(2) };
            } else {
                return { ...field, costoIVA: '' };
            }
        }));
    };

    const handleRegister = async () => {
        const productos = fields.map(field => ({
            nombre: field.nombreProducto,
            cantidad: parseInt(field.cantidad) || 0,
            costo: parseFloat(field.costo) || 0,
            costoIva: parseFloat(field.costoIVA) || 0
        }));

        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0];
        const hora = ahora.toTimeString().split(' ')[0];

        const data = {
            empresa,
            fecha,
            hora,
            productos,
            costoTotal
        };

        try {
            const response = await fetch(backend + 'api/inventarios/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud de inventarios');
            }

            const saveResponse = await fetch(backend + 'api/inventarios/pagos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            if (!saveResponse.ok) {
                throw new Error('Error al guardar los datos en pagos');
            }

            const result = await response.json();
            console.log('Registro de inventario exitoso:', result);

            const saveResult = await saveResponse.json();
            console.log('Datos de pagos guardados exitosamente:', saveResult);

            // Preparar los datos para la factura
            const mensaje = "Informe de Inventario"; // Ajusta el mensaje si es necesario
            setInvoiceData({ productos: fields, mensaje, total: costoTotal });
            setImprimir(true);

        } catch (error) {
            console.error('Error al registrar:', error);
        }
    };

    useEffect(() => {
        calculateTotal(); // Calculate total when fields or addTax change
    }, [fields, addTax]);

    // Reset the print flag after printing
    useEffect(() => {
        if (imprimir) {
            // Here, you would need to reset the `imprimir` state in InvoiceInventory after print
            // For simplicity, this example assumes `InvoiceInventory` handles resetting itself.
            const timer = setTimeout(() => {
                setImprimir(false);
            }, 3000); // Adjust the timeout duration as needed

            return () => clearTimeout(timer);
        }
    }, [imprimir]);

    return (
        <section className="p-4 max-w-4xl mx-auto">

            <div className="mb-6 border-8 rounded-xl p-4 max-h-96 overflow-auto">
                <div className="mb-6">
                    <label htmlFor="empresa" className="block text-lg font-medium text-gray-700 mb-2">
                        Nombre Empresa
                    </label>
                    <input
                        id="empresa"
                        type="text"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        placeholder="Nombre de la Empresa"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6 flex items-center">
                    <input
                        id="add-tax"
                        type="checkbox"
                        checked={addTax}
                        onChange={handleTaxChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="add-tax" className="ml-3 text-lg font-medium text-gray-700">
                        Agregar IVA
                    </label>
                </div>
                <div className="grid grid-cols-7 gap-4 text-lg font-medium text-gray-700 mb-2">
                    <span className="col-span-2">Nombre Producto</span>
                    <span>Cantidad</span>
                    <span>Costo</span>
                    {addTax && <span>Costo con IVA</span>}
                </div>
                <div className="space-y-4">
                    {fields.map(field => (
                        <div key={field.id} className="grid grid-cols-7 gap-4 items-center">
                            <input
                                name="nombreProducto"
                                value={field.nombreProducto}
                                onChange={(e) => handleChange(field.id, e)}
                                className="col-span-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Nombre Producto"
                            />
                            <input
                                name="cantidad"
                                value={field.cantidad}
                                onChange={(e) => handleChange(field.id, e)}
                                className="text-center p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="number"
                                placeholder="Cantidad"
                            />
                            <input
                                name="costo"
                                value={field.costo}
                                onChange={(e) => handleChange(field.id, e)}
                                className="p-3 border border-gray-300 col-span-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Costo"
                            />
                            {addTax && (
                                <input
                                    name="costoIVA"
                                    value={field.costoIVA}
                                    readOnly
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                                    type="text"
                                    placeholder="Costo con IVA"
                                />
                            )}
                            {fields.length > 1 && (
                                <button
                                    onClick={() => removeField(field.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            <p className='p-2 my-8 bg-red-200 rounded-full font-semibold italic' >Valor del Pedido: <span className='font-bold'>{costoTotal}</span></p> {/* Mostrar el costo total */}

            <div className="flex items-center justify-evenly mb-6">
                <button
                    onClick={addField}
                    className="px-6 py-4 bg-blue-500 text-white rounded-lg border-4 border-gray-800 hover:bg-blue-600 transition duration-150"
                >
                    Añadir Producto
                </button>

                <button
                    onClick={handleRegister}
                    className=" px-6 py-4 bg-green-500 text-white rounded-lg border-4 border-gray-800 font-semibold hover:bg-green-600 hover:scale-105 transition duration-150"
                >
                    Registrar
                </button>
            </div>

            {imprimir && <InvoiceInventory productos={fields} mensaje={invoiceData.mensaje} total={invoiceData.total} imprimir={imprimir} />}

        </section>
    );
}

export default FormInventories;
