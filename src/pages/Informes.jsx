import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import axios from "axios";

const Informes = () => {
  const [data, setData] = useState([]);
  const backend = import.meta.env.VITE_BUSINESS_BACKEND;
  const localId = localStorage.getItem("localId");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backend}api/pagos/local/${localId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [backend]);

  // Función para obtener ventas por día
  const getVentasPorDia = () => {
    const today = new Date();
    const ventasDelDia = data.filter((venta) => {
      const fechaVenta = new Date(venta.creado);
      return fechaVenta.toDateString() === today.toDateString();
    });

    return {
      labels: ["Ventas del Día"],
      datasets: [
        {
          label: "Total",
          data: [ventasDelDia.reduce((acc, venta) => acc + venta.valorTotal, 0)],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  };

  // Función para obtener ventas por semana
  const getVentasPorSemana = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const ventasDeLaSemana = data.filter((venta) => {
      const fechaVenta = new Date(venta.creado);
      return fechaVenta >= startOfWeek;
    });

    const totalVentasPorDia = Array(7).fill(0);
    ventasDeLaSemana.forEach((venta) => {
      const fechaVenta = new Date(venta.creado);
      const day = fechaVenta.getDay();
      totalVentasPorDia[day] += venta.valorTotal;
    });

    return {
      labels: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      datasets: [
        {
          label: "Ventas de la Semana",
          data: totalVentasPorDia,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    };
  };

  // Función para obtener ventas por mes
  const getVentasPorMes = () => {
    const currentMonth = new Date().getMonth();
    const ventasDelMes = data.filter((venta) => {
      const fechaVenta = new Date(venta.creado);
      return fechaVenta.getMonth() === currentMonth;
    });

    const totalVentasPorDia = Array(31).fill(0);
    ventasDelMes.forEach((venta) => {
      const fechaVenta = new Date(venta.creado);
      const day = fechaVenta.getDate() - 1; // Ajustar índice
      totalVentasPorDia[day] += venta.valorTotal;
    });

    return {
      labels: Array.from({ length: 31 }, (_, i) => i + 1),
      datasets: [
        {
          label: "Ventas del Mes",
          data: totalVentasPorDia,
          backgroundColor: "rgba(255, 159, 64, 0.6)",
        },
      ],
    };
  };

  // Función para obtener productos más pedidos
  const getProductosMasPedidos = () => {
    const productosCount = {};
    data.forEach((venta) => {
      venta.productos.forEach((producto) => {
        const nombre = producto.nombreProducto;
        productosCount[nombre] = (productosCount[nombre] || 0) + producto.cantidad;
      });
    });

    const sortedProducts = Object.entries(productosCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sortedProducts.map((item) => item[0]),
      datasets: [
        {
          label: "Cantidad de Productos",
          data: sortedProducts.map((item) => item[1]),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    };
  };


  // Función para obtener índice de ganancias
  const getIndiceGanancias = () => {
    const totalGanancias = data.reduce((acc, venta) => acc + venta.valorTotal, 0);
    const indiceGanancias = totalGanancias / data.length || 0; // Evitar división por cero
    return {
      labels: ["Índice de Ganancias"],
      datasets: [
        {
          label: "Ganancias Promedio",
          data: [indiceGanancias],
          backgroundColor: "rgba(255, 206, 86, 0.6)",
        },
      ],
    };
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Informes</h2>
      <div className="grid grid-cols-1 gap-4  md:grid-cols-2">
       
        <div className="col-span-2 bg-white shadow-md rounded-lg p-4 w-1/2  mx-auto">
          <h3 className="text-lg font-bold mb-2">Ventas del Mes</h3>
          <Line data={getVentasPorMes()} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 h-96">
          <h3 className="text-lg font-bold mb-2">Ventas de la Semana</h3>
          <Line data={getVentasPorSemana()} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 h-96">
          <h3 className="text-lg font-bold mb-2">Productos Más Pedidos</h3>
          <Bar data={getProductosMasPedidos()} />
        </div>
      </div>
    </div>
  );
};

export default Informes;

