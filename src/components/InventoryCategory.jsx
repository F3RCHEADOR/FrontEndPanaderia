import React from "react";

const InventoryCategory = ({ title, imageSrc, altText, description, onClick, isSelected }) => {

  const handleCategoriaClick = () => {
    onClick(); // Llamas a la función onClick que se pasa como prop
  }

  return (
    <section>
      <div
        onClick={handleCategoriaClick}
        className={`flex flex-col space-y-2 items-center justify-center cursor-pointer p-4 border-2 rounded-lg ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
      >
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <img src={imageSrc} alt={altText} className="mx-auto size-24" />
        <p>{description}</p>
      </div>
    </section>
  );
}

export default InventoryCategory;
