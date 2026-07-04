import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet } from 'lucide-react';

interface Props {
  onClose: () => void;
  moisture: number;
}

export function FistTestModal({ onClose, moisture }: Props) {
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [drops, setDrops] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropCounterRef = useRef(0);

  const startSqueeze = () => {
    setIsSqueezing(true);
    setDrops([]);
    let count = 0;
    
    let maxDrops = 0;
    if (moisture > 70) maxDrops = 10;
    else if (moisture > 40) maxDrops = 5;
    else maxDrops = 0;

    intervalRef.current = setInterval(() => {
      if (count < maxDrops) {
        setDrops(prev => {
          const newId = dropCounterRef.current++;
          return [...prev, newId];
        });
        count++;
      }
    }, 400);
  };

  const stopSqueeze = () => {
    setIsSqueezing(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => stopSqueeze();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-2">Prueba del Puño</h2>
        <p className="text-gray-600 mb-8 font-medium">Mantén presionado para exprimir la composta y ver la humedad.</p>

        <div className="relative w-48 h-48 mb-8">
          <motion.button
            onPointerDown={startSqueeze}
            onPointerUp={stopSqueeze}
            onPointerLeave={stopSqueeze}
            animate={{ scale: isSqueezing ? 0.9 : 1 }}
            className="w-full h-full bg-amber-800 rounded-full flex items-center justify-center shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] touch-none"
          >
            <span className="text-6xl select-none">✊</span>
          </motion.button>
          
          <AnimatePresence>
            {drops.map(id => (
              <motion.div
                key={id}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: 150, opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                <Droplet className="w-8 h-8 text-blue-500 fill-blue-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="h-16 flex items-center justify-center">
            {drops.length > 8 && <p className="text-xl font-bold text-red-600">¡Demasiada agua! Añade material café.</p>}
            {drops.length > 0 && drops.length <= 8 && <p className="text-xl font-bold text-green-600">¡Humedad perfecta!</p>}
            {drops.length === 0 && isSqueezing && <p className="text-xl font-bold text-orange-600">¡Muy seco! Añade agua.</p>}
        </div>

        <button 
          onClick={onClose}
          className="mt-6 bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-gray-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
