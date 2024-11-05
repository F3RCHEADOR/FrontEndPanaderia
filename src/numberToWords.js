const unidades = [
    'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'
  ];
  const decenas = [
    '', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
  ];
  const decenasEspeciales = [
    'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
  ];
  const centenas = [
    '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
  ];
  
  const convertirCentenas = (num) => {
    const c = Math.floor(num / 100);
    const d = Math.floor((num % 100) / 10);
    const u = num % 10;
    let str = '';
    if (c) {
      str += centenas[c];
    }
    if (d > 1) {
      str += (str ? ' ' : '') + decenas[d];
      if (u) {
        str += ' y ' + unidades[u];
      }
    } else if (d === 1) {
      if (u) {
        str += (str ? ' ' : '') + decenasEspeciales[u - 6];
      } else {
        str += (str ? ' ' : '') + 'diez';
      }
    } else if (u) {
      str += (str ? ' ' : '') + unidades[u];
    }
    return str.trim();
  };
  
  const convertirMiles = (num) => {
    if (num < 1000) return convertirCentenas(num);
    const miles = Math.floor(num / 1000);
    const resto = num % 1000;
    let str = '';
    if (miles === 1) {
      str += 'mil';
    } else {
      str += convertirCentenas(miles) + ' mil';
    }
    if (resto) {
      str += (str ? ' ' : '') + convertirCentenas(resto);
    }
    return str.trim();
  };
  
  const convertirMillones = (num) => {
    if (num < 1000000) return convertirMiles(num);
    const millones = Math.floor(num / 1000000);
    const resto = num % 1000000;
    let str = '';
    if (millones === 1) {
      str += 'un millón';
    } else {
      str += convertirCentenas(millones) + ' millones';
    }
    if (resto) {
      str += (str ? ' ' : '') + convertirMiles(resto);
    }
    return str.trim();
  };
  
  const convertirNumero = (num) => {
    if (num === 0) return 'cero';
    if (num < 1000) return convertirCentenas(num);
    if (num < 1000000) return convertirMiles(num);
    if (num <= 10000000) return convertirMillones(num);
    return 'Número fuera de rango';
  };
  
  export default convertirNumero;
  