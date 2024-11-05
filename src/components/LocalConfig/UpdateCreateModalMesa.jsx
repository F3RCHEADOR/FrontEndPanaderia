import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importa las imágenes directamente
import barra from "../../assets/Mesa/barra-de-bar.png";
import comedor from "../../assets/Mesa/comedor.png";
import comedor1 from "../../assets/Mesa/comedor1.png";
import exterior from "../../assets/Mesa/exterior.png";
import mesaBar from "../../assets/Mesa/mesa-de-bar.png";
import mesa from "../../assets/Mesa/mesa.png";
import restaurante from "../../assets/Mesa/restaurante.png";
import mesaReuniones from "../../assets/Mesa/sala-de-reuniones.png";

// Define las mesas
const mesas = [
  { id: 1, nombre: "Barra", imagen: barra },
  { id: 2, nombre: "Comedor", imagen: comedor },
  { id: 3, nombre: "Comedor 1", imagen: comedor1 },
  { id: 4, nombre: "Exterior", imagen: exterior },
  { id: 5, nombre: "Mesa Bar", imagen: mesaBar },
  { id: 6, nombre: "Mesa", imagen: mesa },
  { id: 7, nombre: "Restaurante", imagen: restaurante },
  { id: 8, nombre: "Mesa de Reuniones", imagen: mesaReuniones },
];

const UpdateMesaModal = ({ isOpen, onClose, onSubmit, mesa, pisos }) => {
  const [nombre, setNombre] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedPiso, setSelectedPiso] = useState("");

  useEffect(() => {
    if (mesa) {
      setNombre(mesa.nombre);
      setSelectedImage(mesa.imagen);
      setSelectedPiso(mesa.piso);
    } else {
      setNombre("");
      setSelectedImage("");
      setSelectedPiso("");
    }
  }, [mesa]);

  const handleImageSelect = (imagen) => {
    setSelectedImage(imagen);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre) {
      alert("Por favor, ingresa un nombre para la mesa.");
      return;
    }
    if (!selectedImage) {
      alert("Por favor, selecciona una imagen para la mesa.");
      return;
    }
    if (!selectedPiso) {
      alert("Por favor, selecciona un piso para la mesa.");
      return;
    }

    const mesaData = {
      nombre,
      imagen: selectedImage,
      piso: selectedPiso,
    };
    onSubmit(mesaData);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
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

  return (
    <div className={`fixed inset-0 max-w-xl mx-auto flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-xl font-bold mb-4">{mesa ? "Actualizar Mesa" : "Crear Mesa"}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nombre de la Mesa:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border rounded p-2 w-full capitalize"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Selecciona un Piso:</label>
            <select
              value={selectedPiso}
              onChange={(e) => setSelectedPiso(e.target.value)}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Selecciona un piso</option>
              {pisos.map((piso) => (
                <option key={piso._id} value={piso._id}>
                  {piso.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-12 md:mb-4">
            <label className="block mb-2">Selecciona una Imagen:</label>
            <Slider {...sliderSettings}>
              {mesas.map((mesa) => (
                <div key={mesa.id} onClick={() => handleImageSelect(mesa.imagen)} className="cursor-pointer">
                  <img src={mesa.imagen} alt={mesa.nombre} className={`w-56 mx-auto md:w-full p-4 ${selectedImage === mesa.imagen ? 'border-2 border-blue-500' : ''}`} />
                </div>
              ))}
            </Slider>
          </div>

          <div className="flex justify-between md:justify-end">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              {mesa ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMesaModal;
