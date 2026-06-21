import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows, useGLTF, Html, useProgress } from '@react-three/drei';
import { Trash2, RotateCw, Move, Plus } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { STORE_PRODUCTS, ROOM_SCENARIOS } from '../../data/mockData';
import type { Product, PlacedFurniture } from '../../types';

// --- SUBCONENTES 3D (Solo usados aquí adentro) ---
const FurnitureModel3D = ({ item, product, isSelected, onSelect }: { item: PlacedFurniture, product: Product, isSelected: boolean, onSelect: (id: string) => void }) => {
  const modelUrls = { desk: '/models/desk.glb', chair: '/models/chair.glb', sofa: '/models/sofa.glb' };
  
  // TUS ESCALAS ACTUALES
  const modelScales = { desk: 0.5, chair: 1, sofa: 0.003 }; 

  // NUEVO: COMPENSACIÓN EN 3 EJES [X, Y, Z]
  // El primer número mueve a los lados, el segundo arriba/abajo, el tercero adelante/atrás.
  const modelPositionOffsets = { 
    // Ajusta el primer y tercer número para alinear el escritorio exactamente sobre su anillo
    desk: [0, 1, 2.4], 
    chair: [0, 0, 0],
    sofa: [0, 0, 0]
  };

  const { scene } = useGLTF(modelUrls[product.type]);
  const clonedScene = scene.clone();

  return (
    <group position={item.position} rotation={[0, item.rotationY, 0]} onClick={(e) => { e.stopPropagation(); onSelect(item.instanceId); }}>
      
      {/* Aplicamos la compensación X, Y, Z directamente al modelo 3D */}
      <primitive 
        object={clonedScene} 
        scale={modelScales[product.type]} 
        position={modelPositionOffsets[product.type]} 
      />
      
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.9, 64]} />
          <meshBasicMaterial color="#4f46e5" side={2} />
        </mesh>
      )}
    </group>
  );
};

const RoomEnvironment3D = ({ room, onFloorClick }: { room: typeof ROOM_SCENARIOS[0], onFloorClick: () => void }) => {
  const [width, depth] = room.size;
  return (
    <group onClick={onFloorClick}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={room.floorColor} />
      </mesh>
      <Grid args={[width, depth]} cellSize={0.5} cellThickness={1} cellColor="#94a3b8" sectionSize={1} sectionThickness={1.5} sectionColor="#64748b" fadeDistance={20} position={[0, 0.01, 0]} />
      <mesh position={[0, 1.5, -depth / 2]} receiveShadow><boxGeometry args={[width, 3, 0.1]} /><meshStandardMaterial color="#f8fafc" /></mesh>
      <mesh position={[width / 2, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><boxGeometry args={[depth, 3, 0.1]} /><meshStandardMaterial color="#f8fafc" /></mesh>
      <ContactShadows position={[0, 0.02, 0]} opacity={0.4} scale={10} blur={2} far={2} />
      <Environment preset="city" />
    </group>
  );
};

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg font-bold text-indigo-600 border border-indigo-100 whitespace-nowrap">
        Cargando modelo... {progress.toFixed(0)}%
      </div>
    </Html>
  );
};

// --- COMPONENTE PRINCIPAL DEL PLANIFICADOR ---
export const SpatialPlanner = ({ initialProduct }: { initialProduct?: Product | null }) => {
  // Conectamos con el estado global
  const { 
    activeRoomId, setActiveRoomId, 
    placedItems, addPlacedItem, updatePlacedItem, removePlacedItem 
  } = useStore();
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const activeRoom = ROOM_SCENARIOS.find(r => r.id === activeRoomId) || ROOM_SCENARIOS[0];
  const selectedItem = placedItems.find(i => i.instanceId === selectedItemId);

  // Auto-añadir el producto si venimos del botón "Probar en 3D"
  useEffect(() => {
    if (initialProduct && placedItems.length === 0) {
      addPlacedItem(initialProduct.id);
      // Forzamos la selección del elemento recién creado buscando el último añadido
      setTimeout(() => {
        const lastItem = placedItems[placedItems.length - 1];
        if(lastItem) setSelectedItemId(lastItem.instanceId);
      }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProduct]);

  return (
    <div className="flex h-[calc(100vh-73px)] w-full font-sans text-slate-800 animate-in fade-in">
      {/* Panel Lateral */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-10">
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">1. Selecciona tu entorno</h2>
            <div className="space-y-2">
              {ROOM_SCENARIOS.map(room => (
                <button
                  key={room.id} onClick={() => setActiveRoomId(room.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${activeRoomId === room.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">2. Añadir Muebles</h2>
            <div className="grid grid-cols-1 gap-2">
              {STORE_PRODUCTS.map(product => (
                <button
                  key={product.id} onClick={() => addPlacedItem(product.id)}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-500 transition-all text-left group"
                >
                  <span className="font-medium text-sm text-slate-700">{product.name}</span>
                  <Plus size={16} className="text-slate-400 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          </section>

          {selectedItem && (
            <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-slate-700">Posición</h2>
                <button onClick={() => { removePlacedItem(selectedItem.instanceId); setSelectedItemId(null); }} className="text-red-500 hover:bg-red-100 p-1.5 rounded-md"><Trash2 size={16} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2"><RotateCw size={14} /> Rotación</label>
                  <input type="range" min="-180" max="180" step="15" value={selectedItem.rotationY * (180 / Math.PI)} onChange={(e) => updatePlacedItem(selectedItem.instanceId, { rotationY: parseFloat(e.target.value) * (Math.PI / 180) })} className="w-full accent-indigo-600" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2"><Move size={14} /> Mover X</label>
                  <input type="range" min={-(activeRoom.size[0]/2) + 0.5} max={(activeRoom.size[0]/2) - 0.5} step="0.1" value={selectedItem.position[0]} onChange={(e) => updatePlacedItem(selectedItem.instanceId, { position: [parseFloat(e.target.value), selectedItem.position[1], selectedItem.position[2]] })} className="w-full accent-indigo-600" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2"><Move size={14} className="rotate-90" /> Mover Z</label>
                  <input type="range" min={-(activeRoom.size[1]/2) + 0.5} max={(activeRoom.size[1]/2) - 0.5} step="0.1" value={selectedItem.position[2]} onChange={(e) => updatePlacedItem(selectedItem.instanceId, { position: [selectedItem.position[0], selectedItem.position[1], parseFloat(e.target.value)] })} className="w-full accent-indigo-600" />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Canvas 3D */}
      <div className="flex-1 relative cursor-crosshair bg-slate-100">
        <Canvas shadows camera={{ position: [0, 4, 6], fov: 45 }}>
          {/* Reemplazamos null por el nuevo Loader */}
          <Suspense fallback={<Loader />}>
            <RoomEnvironment3D room={activeRoom} onFloorClick={() => setSelectedItemId(null)} />
            {placedItems.map(item => (
              <FurnitureModel3D 
                key={item.instanceId} 
                item={item} 
                product={STORE_PRODUCTS.find(p => p.id === item.productId)!}
                isSelected={item.instanceId === selectedItemId}
                onSelect={setSelectedItemId}
              />
            ))}
            
            {/* Limitamos el zoom y la rotación para no "romper" la caja */}
            <OrbitControls 
              makeDefault 
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 2 - 0.05} // No permite mirar debajo del piso
              minDistance={2} // No permite hacer tanto zoom que atravieses el mueble
              maxDistance={12} // No permite alejarte tanto que te salgas de la habitación
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};