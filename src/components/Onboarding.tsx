import React from 'react';
import { GameMode } from '../types';
import { motion } from 'motion/react';

interface Props {
  onSelectMode: (mode: GameMode) => void;
}

export function Onboarding({ onSelectMode }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-4 text-center">
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-bold text-green-800 tracking-tight"
      >
        Guardianes de la Tierra
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl text-green-700 max-w-2xl font-medium"
      >
        ¡Hola! Soy Bacteria Beto. Para empezar nuestra aventura, cuéntame:
      </motion.p>
      
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-bold text-orange-600 mt-4"
      >
        ¿Tienes un jardín grande o un pequeño balcón?
      </motion.h2>

      <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full max-w-lg justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMode('jardin')}
          className="flex-1 bg-green-500 text-white rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center gap-4 hover:bg-green-600 transition-colors"
        >
          <span className="text-6xl">🌳</span>
          <span className="text-2xl font-bold">Jardín Grande</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMode('balcon')}
          className="flex-1 bg-sky-500 text-white rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center gap-4 hover:bg-sky-600 transition-colors"
        >
          <span className="text-6xl">🏢</span>
          <span className="text-2xl font-bold">Pequeño Balcón</span>
        </motion.button>
      </div>
    </div>
  );
}
