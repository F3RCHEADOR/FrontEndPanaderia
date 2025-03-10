import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importa las imágenes directamente
import beer from "../../assets/comida/beer.png";
import biscochuelo from "../../assets/comida/biscochuelo.png";
import cake from "../../assets/comida/cake.png";
import cocacola from "../../assets/comida/cocacola.png";
import coffee from "../../assets/comida/coffe.png";
import cookie from "../../assets/comida/cookie.png";
import croissant from "../../assets/comida/croissant.png";
import dessert from "../../assets/comida/desser.png";
import juice from "../../assets/comida/juice.png";
import juices from "../../assets/comida/juices.png";
import milkshakes from "../../assets/comida/milkshakes.png";
import milkshakes2 from "../../assets/comida/milkshakes2.png";
import others from "../../assets/comida/others.png";
import pan from "../../assets/comida/pan.png";
import sodas from "../../assets/comida/sodas.png";
import arroz from "../../assets/comida/rice.png";
import expecial from "../../assets/comida/star.png";
import fish from "../../assets/comida/fish.png";
import hamburguesa from "../../assets/comida/cheese-burger.png";
import papas from "../../assets/comida/french-fries.png";
import pizza from "../../assets/comida/pizza.png";
import empanada from "../../assets/comida/empanada.png";
import pollo from "../../assets/comida/pollo.png";
import carne from "../../assets/comida/meat.png";


// Define las categorías
const categorias = [
  { id: 1, nombre: "Beer", imagen: beer },
  { id: 2, nombre: "Biscochuelo", imagen: biscochuelo },
  { id: 3, nombre: "Cake", imagen: cake },
  { id: 4, nombre: "Coca Cola", imagen: cocacola },
  { id: 5, nombre: "Coffee", imagen: coffee },
  { id: 6, nombre: "Cookie", imagen: cookie },
  { id: 7, nombre: "Croissant", imagen: croissant },
  { id: 8, nombre: "Dessert", imagen: dessert },
  { id: 9, nombre: "Juice", imagen: juice },
  { id: 10, nombre: "Juices", imagen: juices },
  { id: 12, nombre: "Milkshakes", imagen: milkshakes },
  { id: 13, nombre: "Milkshakes 2", imagen: milkshakes2 },
  { id: 14, nombre: "Others", imagen: others },
  { id: 15, nombre: "Pan", imagen: pan },
  { id: 16, nombre: "Sodas", imagen: sodas },
  { id: 17, nombre: "Arroz", imagen: arroz },
  { id: 18, nombre: "Expecial", imagen: expecial },
  { id: 19, nombre: "Pescados", imagen: fish },
  { id:20, nombre: "Hamburguesa", imagen: hamburguesa },
  { id: 21, nombre: "Papas", imagen: papas },
  { id: 22, nombre: "Empanada", imagen: empanada },
  { id: 23, nombre: "Pizza", imagen: pizza },
  { id: 21, nombre: "Pollo", imagen: pollo },
  { id: 21, nombre: "Carne", imagen: carne },
];

const SliderCategories = ({ onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleClick = (id, imagen) => {
    setSelectedId(id);
    onSelect(imagen); // Pasa la imagen seleccionada al componente padre
    console.log(imagen);
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
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="w-full h-auto mb-8 xl:px-8">
      <h1 className="my-2.5 text-center text-lg font-bold">
        Imagen de la categoría
      </h1>
      <div className="border-x-2 px-1 rounded-lg">
        <Slider {...sliderSettings}>
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className={`p-4 m-1 border-2 rounded-xl group ${
                selectedId === categoria.id ? "border-green-500" : ""
              }`}
            >
              <button
                className="w-full group-hover:scale-110 duration-150 flex items-center justify-center"
                onClick={() => handleClick(categoria.id, categoria.imagen)}
              >
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="mx-auto object-cover rounded"
                />
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SliderCategories;
