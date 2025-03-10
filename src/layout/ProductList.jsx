import Plus from "../assets/sistema/plus.svg";
import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import SliderCategories from "../components/ProducsCategories/SliderCategories";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;

const ProductList = () => {
  const toast = useRef(null);
  const [categorias, setCategorias] = useState([]);
  const [activeCategoriaId, setActiveCategoriaId] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [productos, setProductos] = useState([]); // Estado para productos
  const [hasIva, setHasIva] = useState(false); // Estado para el IVA
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga

  // Cargar las categorías al montar el componente
  const fetchCategorias = async () => {
    const localId = localStorage.getItem("localId");
    if (localId) {
      setLoading(true);
      try {
        const response = await fetch(`${backend}api/categorias/local/${localId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          console.error("Datos recibidos no son un array:", data);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No se encontró localId en el almacenamiento local.");
    }
  };

  // Llama a fetchCategorias cuando el componente se monta
  useEffect(() => {
    fetchCategorias();
  }, [backend]);

  // Manejar el clic en una categoría
  const handleCategoriaClick = async (id) => {
    setActiveCategoriaId(activeCategoriaId === id ? null : id);
    setShowNewCategory(false);

    if (activeCategoriaId !== id) {
      try {
        const response = await fetch(`${backend}api/productos/categoria/${id}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error("Datos recibidos no son un array:", data);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    } else {
      setProductos([]);
    }
  };

  // Mostrar/ocultar el formulario de nueva categoría
  const handleNewCategory = () => {
    setShowNewCategory(!showNewCategory);
    setActiveCategoriaId(null);
  };

  // Mostrar/ocultar el formulario de nuevo producto
  const handleNewProduct = (categoria) => {
    setSelectedCategoria(categoria);
    setActiveCategoriaId(null);
    setShowNewProduct(true);
  };

  const handleCloseNewProduct = () => {
    setShowNewProduct(false);
    setSelectedCategoria(null);
  };


  // Crear nueva categoría
  const createCategory = async () => {
    if (!newCategoryName) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "El nombre de la categoría es requerido.",
        life: 3000,
      });
      return;
    }

    console.log(newCategoryName);
    console.log(selectedImage); // Esto debe ser la URL de la imagen

    const categorie = {
      nombre: newCategoryName,
      imagen: selectedImage,
      localId: localStorage.getItem("localId")
    }

    try {
      const response = await fetch(backend + "api/categorias/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categorie),
      });


      if (response.ok) {
        const newCategory = await response.json();
        setCategorias([...categorias, newCategory]);
        setNewCategoryName("");
        setShowNewCategory(false);
        toast.current.show({
          severity: "success",
          summary: "Categoría Creada",
          detail: `Nombre: ${newCategory.nombre}`,
          life: 15000,
        });
      } else {
        console.log(response)
        throw new Error(response.statusText);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear la categoría",
        life: 3000,
      });
      console.error("Error al crear categoría:", error);
    }
  };


  // Crear nuevo producto
  const createProduct = async () => {
    if (!newProductName || !newProductPrice) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "El nombre y precio del producto son requeridos.",
        life: 3000,
      });
      return;
    }

    const iva = hasIva ? 19 : 0;

    const product = {
      nombre: newProductName,
      precio: parseFloat(newProductPrice),
      iva: iva,
      categoriaId: selectedCategoria, // ID de la categoría seleccionada
      localId: localStorage.getItem("localId"), // Obtener el localId del almacenamiento local
    };

    try {
      const response = await fetch(
        backend + `api/productos/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (response.ok) {
        const newProduct = await response.json();
        const updatedCategorias = categorias.map((categoria) => {
          if (categoria._id === selectedCategoria) {
            return {
              ...categoria,
              productos: [...categoria.productos, newProduct],
            };
          }
          return categoria;
        });
        setCategorias(updatedCategorias);
        setNewProductName("");
        setNewProductPrice("");
        setShowNewProduct(false);
        setSelectedCategoria(null);
        toast.current.show({
          severity: "success",
          summary: "Producto Creado",
          detail: `Nombre: ${newProduct.nombre}`,
          life: 15000,
        });
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el producto",
        life: 3000,
      });
      console.error("Error al crear producto:", error);
    }
  };


  const handleDeleteProduct = async (categoriaId, productoId) => {
    if (confirm("¿Deseas Eliminar el Producto Seleccionado?")) {
      try {
        const response = await fetch(
          `${backend}api/productos/${productoId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchCategorias();
          handleCategoriaClick();
          toast.current.show({
            severity: "success",
            summary: "Producto Eliminado",
            detail: "El producto ha sido eliminado",
            life: 3000,
          });
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al eliminar el producto",
          life: 3000,
        });
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-3xl font-bold mb-6">
            Listado de Categorías/
            <span className="text-sm md:text-xl font-medium">Productos</span>
          </h1>
          <button
            className="bg-green-200 p-2 border-4 border-green-400 rounded-xl font-bold text-gray-800 group hover:scale-105 duration-200 hover:bg-green-300 hover:border-green-500"
            onClick={handleNewCategory}
          >
            <img className="size-8 mx-auto" src={Plus} alt="plus" />
            <span className="text-sm md:text-center group-hover:text-white">
              Crear Categoria
            </span>
          </button>
        </div>


        <div className="relative grid grid-cols-2 md:grid-cols-3 gap-8 p-1">
          {categorias.map((categoria) => (
            <div key={categoria._id} className="mb-4 group h-56">
              <h2 className="text-lg md:text-2xl font-semibold mb-4 text-center">
                {categoria.nombre}
              </h2>
              <button
                className="w-full group-hover:scale-105 duration-150"
                onClick={() => handleCategoriaClick(categoria._id)}
              >
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="mx-auto object-cover rounded mb-4"
                />
              </button>

              {activeCategoriaId === categoria._id && (
                <div className="border-8 border-gray-400 rounded-xl w-full  md:w-auto fixed top-1/2 z-30 h-96 overflow-auto left-1/2 bg-white p-2 md:p-8 transform -translate-y-1/2 -translate-x-1/2">
                  <button className="absolute top-4 right-1 w-8 h-8 bg-red-400 font-bold rounded-full text-center hover:scale-105 hover:text-white" onClick={handleCategoriaClick}>X</button>
                  <ul className="space-y-2 w-auto md:w-[550px]">
                    <h2 className="font-bold text-lg md:text-xl bg-gray-100 underline m-4 flex items-center justify-center h-12 mt-2">
                      Lista de Productos de {categoria.nombre}
                    </h2>
                    <div className="px-4 py-2 grid grid-cols-5 gap-4 font-bold text-sm md:text-lg underline">
                      <span className="col-span-2">Producto</span>
                      <span className="text-center">Precio</span>
                      <span className="text-center">IVA</span>
                      <span className="text-center">Acciones</span>
                    </div>
                    {productos.map((producto) => (
                      <li
                        key={producto._id}
                        className="p-4 grid grid-cols-5 gap-2 bg-white shadow-md"
                      >
                        <span className="col-span-2 font-semibold">
                          {producto.nombre}
                        </span>
                        <span className="text-gray-500 text-center">
                          ${producto.precio}
                        </span>
                        <span className="text-gray-500 text-center">
                          %{producto.iva}
                        </span>
                        <button
                          className="bg-red-400 text-center font-bold rounded-lg"
                          onClick={() =>
                            handleDeleteProduct(categoria._id, producto._id)
                          }
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleNewProduct(categoria)}
                    className="flex items-center justify-center p-2 mt-6 rounded-xl border-4 font-bold bg-green-400 mx-auto"
                  >
                    <p className="space-x-2">
                      Agregar Más
                      <span className="px-2">{categoria.nombre}</span>
                    </p>
                  </button>
                </div>
              )}
            </div>
          ))}
          {showNewProduct && selectedCategoria && (
            <div className={`absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-full md:w-[500px] h-auto bg-white border-8 rounded-xl`}>
              <h2 className="bg-green-200 text-center p-1 mr-10 ml-2 text-base md:text-xl font-bold underline rounded-xl mt-4">
                Nuevo Producto en {selectedCategoria.nombre}
              </h2>
              <button className="absolute top-2 right-1 w-8 h-8 bg-red-300 font-bold rounded-full text-center hover:scale-105 hover:text-white" onClick={handleCloseNewProduct}>X</button>
              <div className="flex flex-col items-center p-6">
                <label className="block mb-2 font-bold">Nombre del Producto</label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="border-4 p-2 rounded mb-4 w-full capitalize"
                />
                <label className="block mb-2 font-bold">Precio</label>
                <input
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="border-4 p-2 rounded mb-4 w-full"
                />
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={hasIva}
                    onChange={() => setHasIva(!hasIva)}
                    className="mr-2"
                  />
                  Incluye IVA (19%)
                </label>
                <button
                  onClick={createProduct}
                  className="bg-green-200 p-2 border-4 border-green-400 rounded-xl font-bold text-gray-800 hover:scale-105 duration-200 hover:bg-green-300 hover:border-green-500"
                >
                  Crear Producto
                </button>
              </div>
            </div>
          )}

          {/* Formulario para Nueva Categoría */}
          {showNewCategory && (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-[500px] bg-white border-8 rounded-xl p-6'>
              <h2 className="bg-green-200 text-center p-2 m-2 text-xl font-bold underline rounded-xl">Nueva Categoría</h2>
              <button className="absolute top-4 right-4 w-8 h-8 bg-red-300 font-bold rounded-full text-center hover:scale-105 hover:text-white" onClick={() => setShowNewCategory(false)}>X</button>
              <div className="flex flex-col items-center">
                <label className="block mb-2">Nombre de la Categoría</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="border p-2 rounded mb-4 w-full"
                />
                <SliderCategories onSelect={setSelectedImage} />
                <button
                  onClick={createCategory}
                  className="bg-green-200 p-2 mt-2 border-4 border-green-400 rounded-xl font-bold text-gray-800 hover:scale-105 duration-200 hover:bg-green-300 hover:border-green-500"
                >
                  Crear Categoría
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default ProductList;
