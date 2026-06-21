import { ArrowLeft, Box, ShoppingCart, LayoutTemplate } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { STORE_PRODUCTS } from '../../data/mockData';
import type { Product } from '../../types';

// --- VISTA 1: CATÁLOGO PRINCIPAL ---
export const StoreFrontView = ({ onProductClick }: { onProductClick: (product: Product) => void }) => (
  <div className="p-8 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-800">Nueva Colección</h1>
      <p className="text-slate-500">Descubre muebles diseñados para tu comodidad.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {STORE_PRODUCTS.map(product => (
        <div key={product.id} onClick={() => onProductClick(product)} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all group">
          <div className="h-64 overflow-hidden relative">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-slate-800">${product.price}</div>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- VISTA 2: DETALLE DEL PRODUCTO ---
export const ProductDetailView = ({ product, onBack, onOpenInPlanner }: { product: Product, onBack: () => void, onOpenInPlanner: (p: Product) => void }) => {
  const { addToCart } = useStore(); // Obtenemos la función global desde el estado

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium">
        <ArrowLeft size={18} /> Volver a la tienda
      </button>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 h-96 md:h-auto relative">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold w-fit mb-4 uppercase tracking-wide">
            <Box size={14} /> Envío Gratis
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">{product.name}</h1>
          <p className="text-3xl font-light text-slate-600 mb-6">${product.price}</p>
          <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 text-sm text-slate-600">
            <strong>Especificaciones:</strong><br/>{product.details}
          </div>
          <div className="flex gap-4">
            <button onClick={() => addToCart(product)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-transform hover:scale-105">
              <ShoppingCart size={20} /> Añadir al carrito
            </button>
            <button onClick={() => onOpenInPlanner(product)} className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <LayoutTemplate size={20} /> Probar en 3D
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};