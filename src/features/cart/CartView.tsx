import { ShoppingCart, Printer, FileText } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export const CartView = ({ onBackToStore }: { onBackToStore: () => void }) => {
  const { cart, cartTotal } = useStore();

  const handleExportPDF = () => {
    // Llama al motor nativo del navegador para imprimir/guardar como PDF
    window.print();
  };

  return (
    // Las clases "print:..." solo se aplican al exportar el PDF
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 print:p-0 print:max-w-full">
      
      {/* Cabecera especial: Solo visible en el PDF */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Kreativ<span className="text-indigo-600">Web</span>
        </h1>
        <p className="text-slate-500 mt-2">Documento Oficial de Cotización</p>
        <p className="text-slate-400 text-sm">Fecha: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-slate-800">Tu Carrito</h1>
        {cart.length > 0 && (
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Printer size={18} /> Exportar PDF
          </button>
        )}
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 print:hidden">
          <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-500">Tu carrito está vacío</h2>
          <button onClick={onBackToStore} className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
            Explorar productos
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none">
          <ul className="divide-y divide-slate-100 print:divide-slate-300">
            {cart.map((item, index) => (
              <li key={index} className="p-6 flex items-center gap-6 print:px-0">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl print:hidden" />
                {/* Icono de respaldo para el PDF para no gastar tinta/peso con la imagen */}
                <div className="hidden print:flex w-16 h-16 bg-slate-100 rounded-lg items-center justify-center text-slate-400">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{item.product.name}</h3>
                  <p className="text-slate-500 text-sm">Cantidad: {item.quantity}</p>
                  {/* Detalles técnicos extra para la cotización formal */}
                  <p className="text-slate-400 text-xs mt-1 hidden print:block">{item.product.details}</p>
                </div>
                <div className="text-xl font-bold text-slate-800">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          
          <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center print:bg-white print:border-t-2 print:border-slate-800 print:px-0 print:mt-4">
            <div>
              <p className="text-slate-500 font-medium">Total Estimado</p>
              <p className="text-3xl font-black text-indigo-600">${cartTotal.toFixed(2)}</p>
            </div>
            <button className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 shadow-lg print:hidden">
              Proceder al pago
            </button>
          </div>

          {/* Pie de página solo para PDF */}
          <div className="hidden print:block mt-12 text-center text-sm text-slate-500">
            <p>Esta cotización tiene una validez de 15 días.</p>
            <p>Gracias por confiar en KreativWeb para la planificación de sus espacios.</p>
          </div>
        </div>
      )}
    </div>
  );
};