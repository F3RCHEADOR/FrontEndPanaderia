// ButtonEditClient.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonEditClient = ({ cliente }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/AddClient', {
      state: {
        clientData: cliente,
        isEdit: true
      }
    });
  };

  return (
    <div className='bg-green-100'>
      <button
        onClick={handleEdit}
        className='bg-blue-600 text-white font-bold w-full text-center flex items-center justify-center mx-auto p-2 mt-4 mb-2 rounded-md hover:scale-110 duration-100'
      >
        Editar Cliente
      </button>
    </div>
  );
};

export default ButtonEditClient;
