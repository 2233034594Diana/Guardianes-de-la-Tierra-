import React from 'react';
import { GameState } from '../types';
import { motion } from 'motion/react';
import { Droplet, ThermometerSun, Leaf, Beaker } from 'lucide-react';
import { cn } from '../lib/utils';

export function ProgressBars({ state }: { state: GameState }) {
  const cnRatio = state.greens === 0 ? state.browns : state.browns / state.greens;
  let cnColor = 'bg-yellow-500';
  if (cnRatio >= 2.5 && cnRatio <= 3.5) cnColor = 'bg-green-500';
  else if (cnRatio > 3.5) cnColor = 'bg-amber-600';
  else if (cnRatio < 2.5) cnColor = 'bg-green-700';

  let tempColor = 'bg-green-500';
  if (state.temperature > 40) tempColor = 'bg-orange-500';
  if (state.temperature > 65) tempColor = 'bg-red-500';

  let moistColor = 'bg-blue-500';
  if (state.moisture < 30) moistColor = 'bg-amber-300';
  if (state.moisture > 70) moistColor = 'bg-blue-800';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full px-4 pt-2">
      <div className="bg-white rounded-xl p-2 shadow-sm border flex items-center gap-2">
        <ThermometerSun className={cn("w-5 h-5", tempColor.replace('bg-', 'text-'))} />
        <div className="flex-1">
          <div className="text-xs font-bold text-gray-500">Temperatura</div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${Math.min(100, (state.temperature / 80) * 100)}%` }} className={cn("h-full", tempColor)} />
          </div>
          <div className="text-xs font-bold text-right mt-1">{state.temperature}°C</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-2 shadow-sm border flex items-center gap-2">
        <Droplet className={cn("w-5 h-5", moistColor.replace('bg-', 'text-'))} />
        <div className="flex-1">
          <div className="text-xs font-bold text-gray-500">Humedad</div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${state.moisture}%` }} className={cn("h-full", moistColor)} />
          </div>
          <div className="text-xs font-bold text-right mt-1">{state.moisture}%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 shadow-sm border flex items-center gap-2">
        <Leaf className={cn("w-5 h-5", cnColor.replace('bg-', 'text-'))} />
        <div className="flex-1">
          <div className="text-xs font-bold text-gray-500">Balance C:N</div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${Math.min(100, (cnRatio / 6) * 100)}%` }} className={cn("h-full", cnColor)} />
          </div>
          <div className="text-xs font-bold text-right mt-1">{cnRatio.toFixed(1)}:1</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 shadow-sm border flex items-center gap-2">
        <Beaker className="w-5 h-5 text-purple-500" />
        <div className="flex-1">
          <div className="text-xs font-bold text-gray-500">pH</div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${(state.ph / 14) * 100}%` }} className="h-full bg-purple-500" />
          </div>
          <div className="text-xs font-bold text-right mt-1">{state.ph}</div>
        </div>
      </div>
    </div>
  );
}
