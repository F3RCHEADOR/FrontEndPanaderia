import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductSlider = ({ onUpdateCart }) => {
  const backend = import.meta.env.VITE_BUSINESS_BACKEND;
  const localId = localStorage.getItem("localId");

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [allProductos, setAllProductos] = useState([]);
  const [activeCategoriaId, setActiveCategoriaId] = useState(null);
  const [activeCategoriaNombre, setActiveCategoriaNombre] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState({}); // Nuevo estado para el carrito

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(
          `${backend}api/categorias/local/${localId}`
        );
        if (!response.ok) throw new Error("Error al cargar las categorías");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    const fetchAllProductos = async () => {
      try {
        const response = await fetch(
          `${backend}api/productos/local/${localId}`
        );
        if (!response.ok) throw new Error("Error al cargar los productos");
        const data = await response.json();
        setAllProductos(data);
      } catch (error) {
        console.error("Error al obtener todos los productos:", error);
      }
    };

    fetchCategorias();
    fetchAllProductos();
  }, [backend, localId]);

  const fetchProductos = async (categoriaId) => {
    try {
      const response = await fetch(
        `${backend}api/productos/categoria/${categoriaId}`
      );
      if (!response.ok) throw new Error("Error al cargar los productos");
      const data = await response.json();
      setProductos(data);

      const updatedCantidades = { ...cantidades };
      data.forEach((producto) => {
        if (!(producto._id in updatedCantidades)) {
          updatedCantidades[producto._id] = 0;
        }
      });
      setCantidades(updatedCantidades);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleCategoriaClick = (id, nombre) => {
    setActiveCategoriaId(id);
    setActiveCategoriaNombre(nombre);
    fetchProductos(id);
  };

  const handleIncrement = (id, nombre, precio) => {
    setCantidades((prev) => {
      const newCantidades = { ...prev, [id]: (prev[id] || 0) + 1 };
      updateCarrito(id, nombre, precio, newCantidades[id]); // Actualizar el carrito
      return newCantidades;
    });
  };

  const handleDecrement = (id, nombre, precio) => {
    setCantidades((prev) => {
      const newCantidades = {
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) - 1),
      };
      updateCarrito(id, nombre, precio, newCantidades[id]); // Actualizar el carrito
      return newCantidades;
    });
  };

  const updateCarrito = (id, nombre, precio, cantidad) => {
    setCarrito((prev) => {
      const newCarrito = { ...prev, [id]: { nombre, precio, cantidad } };
      onUpdateCart(newCarrito); // Enviar el carrito completo al padre
      return newCarrito;
    });
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const displayedProductos = searchTerm
    ? allProductos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productos;

  return (
    <div className="ml-40 md:ml-56 h-full mb-8 xl:px-8">
      <h1 className="my-2.5 bg-gray-200 text-center text-3xl font-bold">
        Categorías
      </h1>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border-4 rounded-md w-4/5 md:w-1/3 focus:border-blue-500 text-center"
        />
      </div>

      <Slider {...sliderSettings}>
        {categorias
          .slice()
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
          .map((categoria) => (
            <div key={categoria._id} className="p-4 border rounded-xl">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {categoria.nombre}
              </h2>
              <button
                className="w-full group-hover:scale-110 duration-150"
                onClick={() =>
                  handleCategoriaClick(categoria._id, categoria.nombre)
                }
              >
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="mx-auto h-20 md:h-28 object-cover rounded mb-4"
                />
              </button>
            </div>
          ))}
      </Slider>

      {activeCategoriaId && (
  <div className="border-4 p-2 mt-8 rounded">
    <h2 className="text-base md:text-xl font-semibold mb-4 text-center md:text-left">
      Productos de la categoría seleccionada: {activeCategoriaNombre}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {displayedProductos.filter(producto => producto.categoriaId === activeCategoriaId).map((producto) => (
        <div key={producto._id} className="p-4 border-4 border-gray-400 rounded-xl">
          <h3 className="text-lg font-semibold mb-2 text-center">{producto.nombre}</h3>
          <div className="flex space-x-2 items-center justify-between my-2">
            <span className="bg-green-300 text-center font-bold">${producto.precio}</span>
            <div className="flex space-x-2">
              <button className="px-2.5 py-1 bg-blue-500 text-white rounded" onClick={() => handleIncrement(producto._id, producto.nombre, producto.precio)}>+</button>
              <span className="font-semibold px-2">{cantidades[producto._id] || 0}</span>
              <button className="px-2.5 py-1 bg-red-500 text-white rounded" onClick={() => handleDecrement(producto._id, producto.nombre, producto.precio)}>-</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{searchTerm && (
  <div className="border-4 p-2 mt-4 rounded">
    <h2 className="text-base md:text-xl font-semibold mb-4">
      Resultados de la búsqueda: "{searchTerm}"
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {displayedProductos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((producto) => (
        <div key={producto._id} className="p-4 border-2 rounded-xl">
          <h3 className="text-lg font-semibold mb-2 text-center">{producto.nombre}</h3>
          <div className="flex space-x-2 items-center justify-between my-2">
            <span className="bg-green-300 text-center font-bold">${producto.precio}</span>
            <div className="flex space-x-2">
              <button className="px-2.5 py-1 bg-blue-500 text-white rounded" onClick={() => handleIncrement(producto._id, producto.nombre, producto.precio)}>+</button>
              <span className="font-semibold px-2">{cantidades[producto._id] || 0}</span>
              <button className="px-2.5 py-1 bg-red-500 text-white rounded" onClick={() => handleDecrement(producto._id, producto.nombre, producto.precio)}>-</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default ProductSlider;
