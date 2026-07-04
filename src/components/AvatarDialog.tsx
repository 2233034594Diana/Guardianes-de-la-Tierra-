import React from 'react';
import { AvatarType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import betoImage from '../assets/images/bacteria_beto_1782933215495.jpg';
import lolaImage from '../assets/images/lombriz_lola_1782933231692.jpg';

interface Props {
  message: { text: string; avatar: AvatarType; isRescue?: boolean } | null;
  onClear: () => void;
}

export function AvatarDialog({ message, onClear }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.9 }}
          className="relative max-w-[280px] w-full flex flex-col items-center gap-1 mt-2"
        >
          {/* Comic Bubble */}
          <div className={cn(
            "relative p-3 rounded-2xl shadow-md border-[3px] w-full",
            message.isRescue ? "bg-red-50 border-red-400" : "bg-white border-green-500"
          )}>
            <div className="relative z-10 pr-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-800">
                {message.avatar === 'beto' ? 'Bacteria Beto' : 'Lombriz Lola'}
              </h4>
              <p className="text-gray-800 text-[13px] leading-tight mt-1 font-medium">{message.text}</p>
            </div>
            
            {/* Bubble Tail pointing down-right */}
            <div className={cn(
              "absolute -bottom-[10px] right-10 w-4 h-4 border-b-[3px] border-r-[3px] transform rotate-45",
              message.isRescue ? "bg-red-50 border-red-400" : "bg-white border-green-500"
            )} />
            
            <button 
              onClick={onClear}
              className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center font-bold text-sm"
            >
              ×
            </button>
          </div>

          {/* Character Image */}
          <div className="self-end mr-4 w-20 h-20 relative flex items-center justify-center overflow-hidden rounded-full shadow-inner border-[3px] bg-white transform hover:scale-105 transition-transform">
             <img 
               src={message.avatar === 'beto' ? betoImage : lolaImage} 
               alt={message.avatar}
               className="w-full h-full object-cover"
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
