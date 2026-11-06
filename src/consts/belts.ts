export type Belt = {
  id: string;
  label: string;
  alt: string;
  color: string;
  buckle?: string | null;
  danLevel?: number | null;
};

export const belts: Belt[] = [
  {
    id: 'white-yellow',
    label: 'P. Amarilla',
    alt: 'Blanco punta amarilla',
    color: '#fff',
    buckle: '#ffe976',
  },
  {
    id: 'yellow',
    label: 'Amarillo',
    alt: 'Amarillo',
    color: '#ffe976',
  },
  {
    id: 'yellow-green',
    label: 'P. Verde',
    alt: 'Amarillo punta verde',
    color: '#ffe976',
    buckle: '#387729',
  },
  {
    id: 'green',
    label: 'Verde',
    alt: 'Verde',
    color: '#387729',
  },
  {
    id: 'green-blue',
    label: 'P. Azul',
    alt: 'Verde punta azul',
    color: '#387729',
    buckle: '#1a4db5',
  },
  {
    id: 'blue',
    label: 'Azul',
    alt: 'Azul',
    color: '#1a4db5',
  },
  {
    id: 'blue-red',
    label: 'P. Roja',
    alt: 'Azul punta roja',
    color: '#1a4db5',
    buckle: '#df000a',
  },
  {
    id: 'red',
    label: 'Rojo',
    alt: 'Rojo',
    color: '#df000a',
  },
  {
    id: 'red-black',
    label: 'P. Negra',
    alt: 'Rojo punta negra',
    color: '#df000a',
    buckle: '#1f1f1f',
  },
  {
    id: 'black',
    label: 'Negro',
    alt: 'Negro',
    color: '#1f1f1f',
  },
  {
    id: 'black-dan-1',
    label: 'Negro',
    alt: 'Negro I DAN',
    color: '#1f1f1f',
    danLevel: 1,
  },
  {
    id: 'black-dan-2',
    label: 'Negro',
    alt: 'Negro II DAN',
    color: '#1f1f1f',
    danLevel: 2,
  },
  {
    id: 'black-dan-3',
    label: 'Negro',
    alt: 'Negro III DAN',
    color: '#1f1f1f',
    danLevel: 3,
  },
];
