import React, { useEffect, useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Onboarding } from './Onboarding';
import { Inventory } from './Inventory';
import { CompostBin } from './CompostBin';
import { AvatarDialog } from './AvatarDialog';
import { FistTestModal } from './FistTestModal';
import { EvaluationModal } from './EvaluationModal';
import { SurvivalTestModal } from './SurvivalTestModal';
import { ProgressBars } from './ProgressBars';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { getAvailableItems } from '../data';

export function MainGame() {
  const { state, setMode, addItem, clearMessage, completeEvaluation, completeSurvivalTest, setFistTest, requestEvaluation, restartLevel, resetGame } = useGameState();
  
  const currentItems = useMemo(() => {
    return state.mode ? getAvailableItems(state.level, state.mode) : [];
  }, [state.level, state.mode]);

  useEffect(() => {
    if (state.level === 4 && state.score > 600) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
      });
    }
  }, [state.level, state.score]);

  if (!state.mode) {
    return <Onboarding onSelectMode={setMode} />;
  }

  const getLevelTitle = () => {
    switch(state.level) {
      case 1: return "Nivel 1: El Alquimista Urbano";
      case 2: return "Nivel 2: El Puente Biotecnológico";
      case 3: return "Nivel 3: Criadero de Lombrices";
      case 4: return "Desafío Final: El Oro Verde";
      default: return "El Oro Verde";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden relative font-sans">
      <header className="flex justify-between items-center p-3 bg-white shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-green-800">{getLevelTitle()}</h2>
          <p className="text-gray-500 font-medium text-xs">Puntos: {state.score}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={resetGame}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-bold shadow-sm transition-colors text-xs border"
            >
                Menú Principal
            </button>
            <button 
                onClick={restartLevel}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-bold shadow-sm transition-colors text-xs border"
            >
                Reiniciar Nivel
            </button>
        </div>
      </header>

      <ProgressBars state={state} />

      <main className="flex-1 relative flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        
        {state.level === 1 && (
            <div className="absolute top-2 right-4 z-30 hidden md:block">
                <button 
                    onClick={() => setFistTest(true)}
                    className="bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-600 rounded-xl p-2 shadow-md font-bold text-xs flex flex-row items-center gap-2 transform hover:scale-105 transition-transform"
                >
                    <span className="text-xl">💧</span>
                    Prueba del Puño
                </button>
            </div>
        )}

        {/* Objectives Panel */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl p-4 shadow-sm border flex flex-col gap-3 z-10 overflow-y-auto">
            <h3 className="font-bold text-gray-700">Misión Actual</h3>
            <div className="flex flex-col gap-2">
                {state.objectives.map(obj => (
                    <div key={obj.id} className="flex items-start gap-2">
                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${obj.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                            {obj.completed && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className={`text-sm font-medium ${obj.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {obj.text}
                        </span>
                    </div>
                ))}
            </div>
            
            {state.isLevelComplete && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestEvaluation}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
                >
                    <span>Evaluar Nivel</span>
                    <span>⭐</span>
                </motion.button>
            )}
        </div>

        {/* Compost Bin Area */}
        <div className="flex-1 relative flex flex-col md:flex-row items-center justify-center gap-4 px-4 pr-16">
            <div className="w-[260px] flex-shrink-0 relative">
                <CompostBin state={state} onFistTestClick={() => setFistTest(true)} />
            </div>
            
            <div className="w-[280px] flex flex-col items-start justify-center z-20">
                {/* Avatar Dialog */}
                <AvatarDialog message={state.avatarMessage} onClear={clearMessage} />
            </div>
        </div>

      </main>

      <div className="mt-auto z-30">
        <Inventory items={currentItems} onItemSelect={addItem} disabled={state.isEvaluating || state.isSurvivalTestActive || state.isLevelComplete} />
      </div>

      <AnimatePresence>
        {state.isFistTestActive && (
          <FistTestModal moisture={state.moisture} onClose={() => setFistTest(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.isEvaluating && (
          <EvaluationModal level={state.level} onResult={completeEvaluation} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.isSurvivalTestActive && (
          <SurvivalTestModal onComplete={completeSurvivalTest} />
        )}
      </AnimatePresence>

    </div>
  );
}
