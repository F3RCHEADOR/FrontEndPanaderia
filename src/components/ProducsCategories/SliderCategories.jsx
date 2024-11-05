import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importa las imágenes directamente
import beer from '../../../public/assets/beer.png';
import biscochuelo from '../../../public/assets/biscochuelo.png';
import cake from '../../../public/assets/cake.png';
import cocacola from '../../../public/assets/cocacola.png';
import coffee from '../../../public/assets/coffe.png';
import cookie from '../../../public/assets/cookie.png';
import croissant from '../../../public/assets/croissant.png';
import dessert from '../../../public/assets/desser.png';
import juice from '../../../public/assets/juice.png';
import juices from '../../../public/assets/juices.png';
import milkshakes from '../../../public/assets/milkshakes.png';
import milkshakes2 from '../../../public/assets/milkshakes2.png';
import others from '../../../public/assets/others.png';
import pan from '../../../public/assets/pan.png';
import sodas from '../../../public/assets/sodas.png';

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
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="w-full h-auto mb-8 xl:px-8">
            <h1 className="my-2.5 text-center text-lg font-bold">Imagen de la categoría</h1>
            <Slider {...sliderSettings}>
                {categorias.map((categoria) => (
                    <div key={categoria.id} className={`p-4 m-1 border rounded-xl group ${selectedId === categoria.id ? 'border-green-500' : 'border-transparent'}`}>
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
    );

};

export default SliderCategories;
