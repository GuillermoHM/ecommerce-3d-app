import { LayoutTemplate, Box, ShoppingCart } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

interface NavbarProps {
  currentView: string;
  onGoToStore: () => void;
  onGoToPlanner: () => void;
  onGoToCart: () => void;
}

export const Navbar = ({ currentView, onGoToStore, onGoToPlanner, onGoToCart }: NavbarProps) => {
  const { cart } = useStore();

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onGoToStore}>
        <div className="bg-indigo-600 text-white p-2 rounded-lg">
          <LayoutTemplate size={24} />
        </div>
        <span className="text-xl font-black text-slate-800 tracking-tight">
          Kreativ<span className="text-indigo-600">Web</span>
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={onGoToStore} 
          className={`font-medium transition-colors ${currentView === 'store' || currentView === 'detail' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Tienda
        </button>
        <button 
          onClick={onGoToPlanner} 
          className={`font-medium flex items-center gap-2 transition-colors ${currentView === 'planner' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Box size={18} /> Planificador 3D
        </button>
        <div className="w-px h-6 bg-slate-200 mx-2"></div>
        <button 
          onClick={onGoToCart}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${cart.length > 0 ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <ShoppingCart size={18} />
          {cart.length > 0 ? `${cart.length} items` : 'Carrito'}
        </button>
      </div>
    </nav>
  );
};