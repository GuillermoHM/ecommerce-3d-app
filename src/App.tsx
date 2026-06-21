import { useState } from 'react';
import { StoreProvider } from './store/StoreContext';
import { StoreFrontView, ProductDetailView } from './features/shop/ShopViews';
import { SpatialPlanner } from './features/planner/SpatialPlanner';
import { CartView } from './features/cart/CartView';
import { Navbar } from './components/layout/NavBar';
import { Toast } from './components/ui/Toast';
import type { Product } from './types';

type ViewState = 'store' | 'detail' | 'planner' | 'cart';

// Este componente contiene la UI, por lo que debe vivir DENTRO del StoreProvider
const AppContent = () => {
  const [currentView, setCurrentView] = useState<ViewState>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Navegación
  const goToStore = () => { setCurrentView('store'); setSelectedProduct(null); };
  const goToCart = () => setCurrentView('cart');
  const goToPlanner = (product?: Product) => { 
    if(product) setSelectedProduct(product); 
    setCurrentView('planner'); 
  };
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* NAVBAR Aislado en components/layout */}
      <Navbar 
        currentView={currentView}
        onGoToStore={goToStore}
        onGoToPlanner={() => goToPlanner()}
        onGoToCart={goToCart}
      />

      {/* SISTEMA DE NOTIFICACIONES Aislado en components/ui */}
      <Toast />

      {/* ÁREA DE VISTAS (Router Manual) */}
      <main className="flex-1">
        {currentView === 'store' && (
          <StoreFrontView onProductClick={handleProductSelect} />
        )}
        
        {currentView === 'detail' && selectedProduct && (
          <ProductDetailView 
            product={selectedProduct} 
            onBack={goToStore} 
            onOpenInPlanner={goToPlanner} 
          />
        )}
        
        {currentView === 'planner' && (
          <SpatialPlanner initialProduct={selectedProduct} />
        )}
        
        {currentView === 'cart' && (
          <CartView onBackToStore={goToStore} />
        )}
      </main>
    </div>
  );
};

// Exportamos la App envuelta en el Proveedor de Estado Global
export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}