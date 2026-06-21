import type { Product, RoomScenario } from '../types';

export const STORE_PRODUCTS: Product[] = [
  { 
    id: 'prod_1', type: 'desk', name: 'Escritorio Nórdico', price: 249.99, color: '#3b82f6',
    description: 'Escritorio minimalista de madera de roble con amplio espacio para trabajar.',
    details: 'Dimensiones: 150x75x70cm. Material: Roble macizo y acero. Garantía: 5 años.',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'prod_2', type: 'chair', name: 'Silla Ergonómica Pro', price: 189.50, color: '#10b981',
    description: 'Silla de oficina con soporte lumbar ajustable y malla transpirable.',
    details: 'Soporta hasta 130kg. Inclinación de 120 grados. Reposabrazos 4D.',
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'prod_3', type: 'sofa', name: 'Sofá Modular Lounge', price: 899.00, color: '#ef4444',
    description: 'Sofá de 3 plazas con tejido antimanchas y cojines de alta densidad.',
    details: 'Dimensiones: 220x90x85cm. Tela lavable. Estructura de pino reforzado.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
  },
];

export const ROOM_SCENARIOS: RoomScenario[] = [
  { id: 'office', name: 'Oficina (Pequeña)', size: [8, 7], floorColor: '#e2e8f0' },
  { id: 'living', name: 'Sala de Estar (Mediana)', size: [10, 9], floorColor: '#fed7aa' },
  { id: 'bedroom', name: 'Dormitorio (Grande)', size: [10, 12], floorColor: '#f1f5f9' },
];