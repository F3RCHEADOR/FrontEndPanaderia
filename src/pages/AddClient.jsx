import React from 'react';
import { useLocation } from 'react-router-dom';
import ListProduct from '../layout/listProducts';

const AddClient = () => {
  const location = useLocation();
  const { clientData, isEdit } = location.state || {};

  return (
    <div className='w-full overflow-hidden'>
      {/* Pasar datos del cliente y estado de edición a ListProduct */}
      <ListProduct clientData={clientData} isEdit={isEdit} />
    </div>
  );
};

export default AddClient;
