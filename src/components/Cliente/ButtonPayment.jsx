// ButtonEditClient.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonPayment = ({ cliente }) => {
  const navigate = useNavigate();
  console.log(cliente)

  const handlePay = () => {
    navigate('/PaidPage', {
      state: {
        clientData: cliente,
        isEdit: true
      }
    });
  };


  return (
    <div className='bg-green-100 '>
      <button onClick={handlePay} className='bg-green-600 text-white font-bold text-center flex items-center justify-center mx-auto p-2 mt-4 mb-2 rounded-xl hover:scale-110 duration-100 '>Efectuar Pago</button>
    </div>
  )
}


export default ButtonPayment;
