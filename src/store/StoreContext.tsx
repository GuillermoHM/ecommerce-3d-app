import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // <-- Importación exclusiva de tipo
import type { Product, CartItem, PlacedFurniture } from '../types'; // <-- Importación exclusiva de tipo

// 1. Definimos qué datos y funciones estarán disponibles globalmente
interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  cartTotal: number;
  
  activeRoomId: string;
  setActiveRoomId: (id: string) => void;
  placedItems: PlacedFurniture[];
  addPlacedItem: (productId: string) => void;
  updatePlacedItem: (instanceId: string, updates: Partial<PlacedFurniture>) => void;
  removePlacedItem: (instanceId: string) => void;
  
  toastMessage: string | null;
}

// 2. Creamos el Contexto
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// 3. Creamos el Componente Proveedor
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>('office');
  const [placedItems, setPlacedItems] = useState<PlacedFurniture[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`${product.name} añadido al carrito`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const addPlacedItem = (productId: string) => {
    const newItem: PlacedFurniture = {
      instanceId: crypto.randomUUID(),
      productId,
      position: [0, 0, 0],
      rotationY: 0,
    };
    setPlacedItems([...placedItems, newItem]);
  };

  const updatePlacedItem = (instanceId: string, updates: Partial<PlacedFurniture>) => {
    setPlacedItems(items => items.map(item => item.instanceId === instanceId ? { ...item, ...updates } : item));
  };

  const removePlacedItem = (instanceId: string) => {
    setPlacedItems(items => items.filter(item => item.instanceId !== instanceId));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <StoreContext.Provider value={{
      cart, addToCart, cartTotal,
      activeRoomId, setActiveRoomId,
      placedItems, addPlacedItem, updatePlacedItem, removePlacedItem,
      toastMessage
    }}>
      {children}
    </StoreContext.Provider>
  );
};

// 4. Hook personalizado
// Le decimos a ESLint que ignore la regla de Fast Refresh solo para esta línea
// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore debe usarse dentro de un StoreProvider');
  }
  return context;
};