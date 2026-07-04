import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onComplete: (success: boolean) => void;
}

export function SurvivalTestModal({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "¡Hora de la Prueba de Supervivencia de 24 horas!", btn: "Iniciar Prueba" },
    { text: "Hemos colocado 10 lombrices de prueba en la composta...", btn: "Esperar 24h (Simuladas)" },
    { text: "¡Han pasado 24 horas! Contando lombrices vivas...", btn: "Ver resultados" }
  ];

  const advance = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl"
      >
        <div className="text-6xl mb-4">🪱⏳</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Prueba Biológica</h2>
        
        <div className="h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.p
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg text-gray-700 font-medium"
                >
                    {steps[step].text}
                </motion.p>
            </AnimatePresence>
        </div>

        <button
          onClick={advance}
          className="mt-6 bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 w-full shadow-md"
        >
          {steps[step].btn}
        </button>
      </motion.div>
    </div>
  );
}
