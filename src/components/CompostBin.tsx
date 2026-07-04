import React from 'react';
import { GameState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  state: GameState;
  onFistTestClick: () => void;
}

export function CompostBin({ state, onFistTestClick }: Props) {
  const isVermi = state.mode === 'balcon';
  const fillPercentage = Math.min(100, (state.compostItems.length / 15) * 100);

  let compostColor = 'bg-amber-800';
  const cnRatio = state.greens === 0 ? state.browns : state.browns / state.greens;
  
  if (cnRatio < 2) compostColor = 'bg-green-900'; // Too many greens
  else if (cnRatio > 4) compostColor = 'bg-yellow-900'; // Too many browns
  else compostColor = 'bg-amber-900'; // Healthy
  
  if (state.level >= 3) compostColor = 'bg-stone-800';
  if (state.level === 4) compostColor = 'bg-zinc-900';

  return (
    <div className="relative w-full max-w-[260px] mx-auto aspect-square flex flex-col items-center justify-end mt-4">
      
      <AnimatePresence>
        {state.activeEvent === 'moscas' && (
          <motion.div key="moscas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <span className="text-6xl animate-bounce drop-shadow-md">🦟🦟</span>
          </motion.div>
        )}
        {state.moisture > 70 && (
          <motion.div key="charcos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-4 z-20 pointer-events-none flex items-center justify-center gap-2">
            <span className="text-4xl text-blue-500 drop-shadow-md">💧💧 charcos</span>
          </motion.div>
        )}
        {state.moisture < 30 && (
          <motion.div key="polvo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-4 z-20 pointer-events-none flex items-center justify-center gap-2">
            <span className="text-4xl text-amber-500 drop-shadow-md">🏜️ polvo</span>
          </motion.div>
        )}
        {state.temperature > 55 && (
          <motion.div key="vapor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center pb-10">
            <span className="text-5xl animate-pulse text-gray-400 drop-shadow-md">💨 vapor</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "relative w-3/4 h-3/4 rounded-b-3xl border-4 border-t-0 shadow-inner overflow-hidden",
        isVermi ? "border-blue-800 bg-blue-50" : "border-amber-900 bg-amber-50"
      )}>
        <motion.div 
          className={cn("absolute bottom-0 left-0 right-0 transition-colors duration-1000", compostColor)}
          initial={{ height: 0 }}
          animate={{ height: `${fillPercentage}%` }}
          transition={{ type: 'spring', bounce: 0.2 }}
        >
           <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1 p-2 overflow-hidden opacity-90">
              {state.compostItems.slice(-15).map((item, i) => {
                const startIndex = Math.max(0, state.compostItems.length - 15);
                const absoluteIndex = startIndex + i;
                return (
                  <motion.span 
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0 }}
                    key={`${item.id}-${absoluteIndex}`} 
                    className="text-3xl drop-shadow-md"
                  >
                    {item.emoji}
                  </motion.span>
                );
              })}
           </div>
        </motion.div>
      </div>
    </div>
  );
}
