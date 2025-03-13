import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ButtonPayment = ({ cliente }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  const handlePay = () => {
    navigate("/PaidPage", {
      state: {
        clientData: cliente,
        isEdit: true,
      },
    });
  };

  useEffect(() => {
    // Obtener el rol de localStorage cuando el componente se monta
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || ""); // Establecer el rol en el estado o una cadena vacía si no está definido
  }, []);

  return (
    <>
      {role && (role === "admin" || role === "cajero") && (
        <div className="bg-green-100">
          <button
            onClick={handlePay}
            className="bg-green-600 text-white w-full font-bold text-center flex items-center justify-center mx-auto p-2 mt-4 mb-2 rounded-md hover:scale-105 dtransform transition-all"
          >
            Efectuar Pago
          </button>
        </div>
      )}
    </>
  );
};

export default ButtonPayment;
