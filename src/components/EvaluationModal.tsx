import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  level: number;
  onResult: (success: boolean) => void;
}

const EVALUATIONS: Record<number, any> = {
  1: {
    avatar: 'beto',
    question: "¡Guardián! Para que mi panza se caliente y limpie los gérmenes, ¿qué ingrediente 'café' me darías para guardar equilibrio?",
    options: [
      { id: 'A', text: 'Cáscaras de sandía', correct: false, feedback: '¡Uy! Eso me daría mucha humedad o atraería moscas. ¡Busca algo seco y crujiente!' },
      { id: 'B', text: 'Cartón de huevo troceado', correct: true, feedback: '¡Exacto! El cartón es como el escudo que me ayuda a respirar.' },
      { id: 'C', text: 'Un pedazo de queso', correct: false, feedback: '¡No! Eso es material prohibido.' },
    ]
  },
  2: {
    avatar: 'beto',
    question: "¡Uf, qué calor hizo en la Fase Termófila! ¿Para qué sirvió llegar a más de 55°C?",
    options: [
      { id: 'A', text: 'Para cocinar las verduras', correct: false, feedback: '¡No somos una sopa! Piensa en qué pasa con los bichos malos a esa temperatura.' },
      { id: 'B', text: 'Para eliminar patógenos y semillas de maleza', correct: true, feedback: '¡Muy bien! El calor actúa como una barrera de seguridad natural.' },
      { id: 'C', text: 'Para atraer moscas', correct: false, feedback: 'Al revés, el calor extremo espanta a las plagas.' },
    ]
  },
  3: {
    avatar: 'lola',
    question: "¡Hola! Soy Lola. Si notas que mi casa (la composta) huele muy feo y tiene charcos, ¿qué necesitas agregar rápido?",
    options: [
      { id: 'A', text: 'Más restos de fruta (material verde)', correct: false, feedback: '¡Eso haría más charcos! Necesito algo que absorba el agua.' },
      { id: 'B', text: 'Hojas secas o aserrín (material café)', correct: true, feedback: '¡Me salvaste! Los cafés secan los charcos y quitan los malos olores.' },
      { id: 'C', text: 'Agua de la regadera', correct: false, feedback: '¡Me voy a ahogar!' },
    ]
  },
  4: {
    avatar: 'lola',
    question: "¿Cómo sabes que nuestra aventura ha terminado y el Oro Verde está listo?",
    options: [
      { id: 'A', text: 'Cuando huele a podrido', correct: false, feedback: '¡Nunca! Si huele feo, algo salió mal.' },
      { id: 'B', text: 'Cuando está caliente', correct: false, feedback: 'Si está caliente, ¡las bacterias siguen trabajando!' },
      { id: 'C', text: 'Cuando huele a tierra de bosque y no se distinguen los restos', correct: true, feedback: '¡Eres un verdadero Guardián de la Tierra!' },
    ]
  }
};

export function EvaluationModal({ level, onResult }: Props) {
  const data = EVALUATIONS[level] || EVALUATIONS[4];
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (id: string) => {
    if (showFeedback) return;
    setSelected(id);
    setShowFeedback(true);
  };

  const selectedOption = data.options.find((o: any) => o.id === selected);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-green-500 relative"
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white border-4 border-green-500 flex items-center justify-center text-5xl">
          {data.avatar === 'beto' ? '🦠' : '🪱'}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mt-6 text-center mb-6">
          {data.question}
        </h2>

        <div className="flex flex-col gap-3">
          {data.options.map((opt: any) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={showFeedback}
              className={cn(
                "p-4 rounded-xl text-left font-medium text-gray-700 transition-all border-2",
                !showFeedback ? "bg-gray-50 border-gray-200 hover:border-green-400 hover:bg-green-50" :
                opt.id === selected && opt.correct ? "bg-green-100 border-green-500" :
                opt.id === selected && !opt.correct ? "bg-red-100 border-red-500" :
                opt.correct ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                  showFeedback && opt.correct ? "bg-green-500 text-white" :
                  showFeedback && opt.id === selected && !opt.correct ? "bg-red-500 text-white" :
                  "bg-white border-2 border-gray-300 text-gray-500"
                )}>
                  {opt.id}
                </div>
                <span>{opt.text}</span>
              </div>
            </button>
          ))}
        </div>

        {showFeedback && selectedOption && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-6 p-4 rounded-xl text-center font-bold",
              selectedOption.correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            {selectedOption.feedback}
          </motion.div>
        )}

        {showFeedback && (
          <button
            onClick={() => onResult(selectedOption?.correct || false)}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {selectedOption?.correct ? '¡Continuar!' : 'Intentarlo de nuevo'}
          </button>
        )}
      </motion.div>
    </div>
  );
}
