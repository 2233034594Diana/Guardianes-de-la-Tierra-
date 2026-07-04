import { Item, GameMode } from './types';

export const INVENTORY: Item[] = [
  // VERDES (Nitrógeno y Humedad)
  { id: 'nopal', name: 'Nopal', category: 'verde', emoji: '🌵', description: 'Aporta mucho nitrógeno y agua.', moistureEffect: 15, carbonEffect: 0, nitrogenEffect: 10, phEffect: 0, minLevel: 1 },
  { id: 'aguacate', name: 'Cáscaras de Aguacate', category: 'verde', emoji: '🥑', description: 'Ricas en nutrientes.', moistureEffect: 5, carbonEffect: 0, nitrogenEffect: 10, phEffect: 0, minLevel: 1 },
  { id: 'jitomate', name: 'Restos de Verdura', category: 'verde', emoji: '🥬', description: 'Se descomponen rápido.', moistureEffect: 10, carbonEffect: 0, nitrogenEffect: 15, phEffect: -0.5, minLevel: 1 },
  { id: 'platano', name: 'Restos de Fruta', category: 'verde', emoji: '🍌', description: 'Aportan potasio.', moistureEffect: 10, carbonEffect: 0, nitrogenEffect: 10, phEffect: 0, minLevel: 1 },
  { id: 'estiercol', name: 'Estiércol', category: 'verde', emoji: '🐄', description: 'Acelera todo el proceso.', moistureEffect: 10, carbonEffect: 0, nitrogenEffect: 20, phEffect: 0, minLevel: 1, modeRestriction: 'jardin' },
  { id: 'cafe', name: 'Posos de Café', category: 'verde', emoji: '☕', description: '¡Son nitrógeno puro!', moistureEffect: 5, carbonEffect: 0, nitrogenEffect: 15, phEffect: -1, minLevel: 1 },

  // CAFÉS (Carbono y Porosidad)
  { id: 'hojas', name: 'Hojas Secas', category: 'cafe', emoji: '🍂', description: 'Evita malos olores.', moistureEffect: -5, carbonEffect: 15, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },
  { id: 'carton', name: 'Cartón', category: 'cafe', emoji: '📦', description: 'Absorbe humedad.', moistureEffect: -10, carbonEffect: 10, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },
  { id: 'aserrin', name: 'Aserrín', category: 'cafe', emoji: '🪵', description: 'Mantiene equilibrio.', moistureEffect: -10, carbonEffect: 15, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },
  { id: 'paja', name: 'Paja o Rastrojo', category: 'cafe', emoji: '🌾', description: 'Crea túneles de aire.', moistureEffect: -5, carbonEffect: 15, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },

  // ESPECIALES (Herramientas y Neutralizadores)
  { id: 'cascaron', name: 'Cascarón Triturado', category: 'especial', emoji: '🥚', description: 'El Escudo de pH.', moistureEffect: 0, carbonEffect: 0, nitrogenEffect: 0, phEffect: 2, minLevel: 1 },
  { id: 'agua', name: 'Agua / Regadera', category: 'especial', emoji: '💧', description: 'Sube la humedad.', moistureEffect: 20, carbonEffect: 0, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },
  { id: 'pala', name: 'Pala (Volteo)', category: 'especial', emoji: '🛠️', description: 'Voltea y enfría.', moistureEffect: -5, carbonEffect: 0, nitrogenEffect: 0, phEffect: 0, minLevel: 2 },
  
  // NIVEL 3 ESPECIALES
  { id: 'lombrices', name: 'Lombrices', category: 'especial', emoji: '🪱', description: 'Trabajadoras del humus.', moistureEffect: 0, carbonEffect: 0, nitrogenEffect: 0, phEffect: 0, minLevel: 3, modeRestriction: 'balcon' },
  { id: 'precomposta', name: 'Precomposta', category: 'especial', emoji: '🟤', description: 'Material estabilizado.', moistureEffect: 0, carbonEffect: 5, nitrogenEffect: 5, phEffect: 0, minLevel: 3 },
  
  // NIVEL 4 ESPECIALES
  { id: 'criba', name: 'Herramientas de Cosecha', category: 'especial', emoji: '🥅', description: 'Para separar el Oro Verde.', moistureEffect: 0, carbonEffect: 0, nitrogenEffect: 0, phEffect: 0, minLevel: 4 },

  // PROHIBIDOS
  { id: 'carne', name: 'Carne', category: 'prohibido', emoji: '🥩', description: 'Atrae plagas.', moistureEffect: 0, carbonEffect: 0, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },
  { id: 'lacteo', name: 'Lácteos', category: 'prohibido', emoji: '🧀', description: 'Se pudre y enferma.', moistureEffect: 0, carbonEffect: 0, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },
  { id: 'excremento_perro', name: 'Excremento', category: 'prohibido', emoji: '💩', description: 'Tiene gérmenes.', moistureEffect: 0, carbonEffect: 0, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },
  { id: 'aceite', name: 'Aceite', category: 'prohibido', emoji: '🛢️', description: 'Asfixia la composta.', moistureEffect: 0, carbonEffect: 0, nitrogenEffect: 0, phEffect: 0, minLevel: 1 },
];

export function getAvailableItems(level: number, mode: GameMode): Item[] {
  return INVENTORY.filter(item => 
    (!item.minLevel || level >= item.minLevel) && 
    (!item.modeRestriction || item.modeRestriction === mode)
  );
}
