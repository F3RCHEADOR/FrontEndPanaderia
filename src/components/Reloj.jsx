import React, { useState, useEffect } from 'react';

function Reloj() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date());
    }, 60000); // 60000 milisegundos = 1 minuto

    return () => clearInterval(intervalo);
  }, []);

  return (
    <button className="text-2xl xl:text-3xl font-bold text-gray-800">
      {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </button>

  );
}

export default Reloj;
