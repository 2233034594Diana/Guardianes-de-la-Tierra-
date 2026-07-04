import React from 'react';
import { Item } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  items: Item[];
  onItemSelect: (item: Item) => void;
  disabled?: boolean;
}

export function Inventory({ items, onItemSelect, disabled }: Props) {
  return (
    <div className={cn(
      "w-full bg-white p-3 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] border-t transition-opacity",
      disabled ? "opacity-50 pointer-events-none" : "opacity-100"
    )}>
      <h3 className="font-bold text-gray-500 text-xs mb-2 px-2">INVENTARIO</h3>
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory hide-scrollbar">
        {items.map(item => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onItemSelect(item)}
            className={cn(
              "snap-start flex-shrink-0 w-20 bg-gray-50 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 shadow-sm border-2 transition-colors",
              item.category === 'verde' ? 'border-green-200 hover:border-green-400 hover:bg-green-50' :
              item.category === 'cafe' ? 'border-amber-200 hover:border-amber-400 hover:bg-amber-50' :
              item.category === 'prohibido' ? 'border-red-200 hover:border-red-400 hover:bg-red-50' :
              'border-purple-200 hover:border-purple-400 hover:bg-purple-50'
            )}
          >
            <span className="text-3xl drop-shadow-sm">{item.emoji}</span>
            <span className="text-[10px] font-bold text-center leading-tight text-gray-700">{item.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
