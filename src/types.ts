export type GameMode = 'jardin' | 'balcon' | null;
export type AvatarType = 'beto' | 'lola';

export type ItemCategory = 'verde' | 'cafe' | 'especial' | 'prohibido';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  emoji: string;
  description: string;
  moistureEffect: number;
  carbonEffect: number;
  nitrogenEffect: number;
  phEffect: number;
  minLevel?: number;
  modeRestriction?: 'jardin' | 'balcon';
}

export type EventType = 'tormenta' | 'hormigas' | 'moscas' | 'fuego' | 'escape_lola' | null;

export interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

export interface GameState {
  mode: GameMode;
  level: number;
  greens: number;
  browns: number;
  moisture: number; // 0 to 100
  temperature: number; // Celsius
  ph: number; // 1 to 14
  compostItems: Item[];
  activeEvent: EventType;
  avatarMessage: { text: string; avatar: AvatarType; isRescue?: boolean } | null;
  score: number;
  isEvaluating: boolean;
  evaluationPassed: boolean;
  isFistTestActive: boolean;
  isSurvivalTestActive: boolean;
  isLevelComplete: boolean;
  hasReachedThermophilic: boolean;
  objectives: Objective[];
}

