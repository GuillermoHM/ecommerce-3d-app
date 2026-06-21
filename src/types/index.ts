// src/types/index.ts

// Representa un producto en el catálogo de la tienda
export interface Product {
  id: string;
  type: 'desk' | 'chair' | 'sofa';
  name: string;
  price: number;
  description: string;
  details: string;
  imageUrl: string;
  color: string; // Útil para generar iconos o colores de respaldo
}

// Representa una instancia única de un mueble colocado en el lienzo 3D
export interface PlacedFurniture {
  instanceId: string; // ID único para el objeto en el lienzo (necesario por si pones 2 sillas iguales)
  productId: string;  // Referencia al ID del producto original del catálogo
  position: [number, number, number]; // Coordenadas [X, Y, Z]
  rotationY: number;  // Rotación sobre su propio eje en radianes
}

// Representa los escenarios de las habitaciones
export interface RoomScenario {
  id: string;
  name: string;
  size: [number, number]; // [Ancho, Profundidad]
  floorColor: string;
}

// Representa un elemento dentro del carrito de compras
export interface CartItem {
  product: Product;
  quantity: number;
}