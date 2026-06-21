import { Check } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export const Toast = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-8">
      <div className="bg-green-500 p-1 rounded-full">
        <Check size={14} />
      </div>
      <span className="font-medium text-sm">{toastMessage}</span>
    </div>
  );
};