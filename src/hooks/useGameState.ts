import { useState, useEffect } from 'react';
import { GameMode, GameState, Item, EventType, AvatarType, Objective } from '../types';

const INITIAL_STATE: GameState = {
  mode: null,
  level: 1,
  greens: 0,
  browns: 0,
  moisture: 50,
  temperature: 20,
  ph: 7,
  compostItems: [],
  activeEvent: null,
  avatarMessage: null,
  score: 0,
  isEvaluating: false,
  evaluationPassed: false,
  isFistTestActive: false,
  isSurvivalTestActive: false,
  isLevelComplete: false,
  hasReachedThermophilic: false,
  objectives: [],
};

const getLevelObjectives = (level: number, mode: GameMode): Objective[] => {
  if (level === 1) {
    return [
      { id: 'verdes', text: 'Agrega 2 materiales verdes', completed: false },
      { id: 'cafes', text: 'Agrega 6 materiales cafés', completed: false },
      { id: 'humedad', text: 'Mantén humedad entre 40% y 60%', completed: false },
    ];
  }
  if (level === 2) {
    return [
      { id: 'calor', text: 'Sube la temperatura a 55°C (Fase Termófila)', completed: false },
      { id: 'frio', text: 'Usa la pala para enfriar por debajo de 30°C', completed: false },
    ];
  }
  if (level === 3) {
    return [
      { id: 'precompost', text: 'Agrega material precompostado', completed: false },
      { id: 'lombrices', text: mode === 'balcon' ? 'Agrega lombrices' : 'Agrega más hojas secas', completed: false },
      { id: 'volumen', text: 'Alcanza 10 materiales en la composta', completed: false },
    ];
  }
  if (level === 4) {
    return [
      { id: 'llenar', text: 'Llena la composta con 6 materiales más', completed: false },
      { id: 'cosecha', text: 'Usa las herramientas de cosecha', completed: false },
    ];
  }
  return [];
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const setMode = (mode: GameMode) => {
    setState((prev) => ({ 
        ...prev, 
        mode, 
        objectives: getLevelObjectives(1, mode) 
    }));
    triggerMessage(
      mode === 'jardin'
        ? '¡Genial! Haremos una composta tradicional en el jardín. Necesitaremos un bote grande.'
        : '¡Perfecto! Haremos vermicompostaje con lombrices en tu balcón.',
      'beto'
    );
  };

  const triggerMessage = (text: string, avatar: AvatarType, isRescue: boolean = false) => {
    setState((prev) => ({
      ...prev,
      avatarMessage: { text, avatar, isRescue },
    }));
  };

  const clearMessage = () => {
    setState((prev) => ({ ...prev, avatarMessage: null }));
  };

  const triggerEvent = (event: EventType) => {
    setState((prev) => ({ ...prev, activeEvent: event }));
    switch (event) {
      case 'tormenta':
        triggerMessage('¡Glu-glu! ¡Exceso de agua! Arrastra material café (hojas o cartón) para absorber el agua.', 'beto', true);
        break;
      case 'hormigas':
        triggerMessage('¡Muy seco! Las hormigas invaden. Usa la regadera o agua para subir la humedad.', 'beto', true);
        break;
      case 'moscas':
        triggerMessage('¡Guardián! Hay moscas. ¡Rápido, ponle una sábana de hojas secas encima (material café)!', 'lola', true);
        break;
      case 'fuego':
        triggerMessage('¡Uff, sauna! Usa la pala para voltear y enfriar.', 'beto', true);
        break;
      case 'escape_lola':
        triggerMessage('¡Ay! Muy ácido. Agrega cascarón de huevo triturado para neutralizar.', 'lola', true);
        break;
    }
  };

  const addItem = (item: Item) => {
    if (state.activeEvent) {
      resolveEvent(item);
      return;
    }

    if (item.category === 'prohibido') {
      triggerMessage(`¡Cuidado! ${item.description}`, 'beto', true);
      if (item.id === 'carne' || item.id === 'lacteo') {
        triggerEvent('moscas');
      } else {
        triggerEvent('tormenta');
      }
      return;
    }

    setState((prev) => {
      let newGreens = prev.greens + (item.category === 'verde' ? 1 : 0);
      let newBrowns = prev.browns + (item.category === 'cafe' ? 1 : 0);
      
      let newMoisture = Math.min(100, Math.max(0, prev.moisture + item.moistureEffect));
      let newTemp = prev.temperature;
      let newPh = Math.min(14, Math.max(1, prev.ph + item.phEffect));

      if (item.id === 'pala') {
        newTemp = Math.max(20, newTemp - 35);
      } else if (item.category === 'verde' || item.category === 'cafe') {
        newTemp += 5;
      }

      const newState = {
        ...prev,
        greens: newGreens,
        browns: newBrowns,
        moisture: newMoisture,
        temperature: newTemp,
        ph: newPh,
        compostItems: item.category !== 'especial' ? [...prev.compostItems, item] : prev.compostItems,
        score: prev.score + 10,
        isEvaluating: false,
      };

      return updateObjectives(newState, item);
    });
  };

  const updateObjectives = (state: GameState, item: Item, skipMessage: boolean = false): GameState => {
      let objs = [...state.objectives];
      let isComplete = state.isLevelComplete;
      let hasReachedThermophilic = state.hasReachedThermophilic;

      if (state.level === 1) {
          if (state.greens >= 2) objs.find(o => o.id === 'verdes')!.completed = true;
          if (state.browns >= 6) objs.find(o => o.id === 'cafes')!.completed = true;
          if (state.moisture >= 40 && state.moisture <= 60) objs.find(o => o.id === 'humedad')!.completed = true;
          else objs.find(o => o.id === 'humedad')!.completed = false;

          isComplete = objs.every(o => o.completed);
          
          if (!isComplete && !skipMessage) {
              if (item.category === 'verde') triggerMessage('¡Bien! Los verdes dan nutrientes. Ahora equilibra con más cafés.', 'beto');
              if (item.category === 'cafe') triggerMessage('¡Excelente! Los cafés dan estructura y evitan olores.', 'beto');
          }
      } else if (state.level === 2) {
          if (state.temperature >= 55) {
              objs.find(o => o.id === 'calor')!.completed = true;
              hasReachedThermophilic = true;
          }
          if (hasReachedThermophilic && state.temperature <= 30) {
              objs.find(o => o.id === 'frio')!.completed = true;
          }
          isComplete = objs.every(o => o.completed);

          if (!isComplete && !skipMessage) {
              if (item.id !== 'pala') {
                  triggerMessage(`Sigue agregando material. Temperatura actual: ${state.temperature}°C`, 'beto');
              } else {
                  triggerMessage('¡Volteo! El aire fresco ayuda a controlar la temperatura.', 'beto');
              }
          }
      } else if (state.level === 3) {
          if (item.id === 'precomposta') objs.find(o => o.id === 'precompost')!.completed = true;
          if (item.id === 'lombrices' || (state.mode === 'jardin' && item.category === 'cafe' && state.compostItems.length > 5)) objs.find(o => o.id === 'lombrices')!.completed = true;
          if (state.compostItems.length >= 10) objs.find(o => o.id === 'volumen')!.completed = true;
          
          isComplete = objs.every(o => o.completed);

          if (!isComplete && !skipMessage) triggerMessage('Vamos llenando la composta, ¡se ve muy bien!', 'lola');
      } else if (state.level === 4) {
          if (state.compostItems.length >= 6) objs.find(o => o.id === 'llenar')!.completed = true;
          if (item.id === 'criba') objs.find(o => o.id === 'cosecha')!.completed = true;

          isComplete = objs.every(o => o.completed);
          if (!isComplete && item.id !== 'criba' && !skipMessage) triggerMessage('Ya falta poco, sigue agregando material.', 'lola');
      }

      if (isComplete && !state.isLevelComplete && !skipMessage) {
          triggerMessage('¡Objetivos cumplidos! Presiona "Evaluar Nivel" para avanzar.', 'lola');
      }

      return { ...state, objectives: objs, isLevelComplete: isComplete, hasReachedThermophilic };
  };

  const resolveEvent = (item: Item) => {
    setState((prev) => {
      let resolved = false;
      const { activeEvent } = prev;

      if (activeEvent === 'tormenta' && item.category === 'cafe') resolved = true;
      if (activeEvent === 'hormigas' && item.id === 'agua') resolved = true;
      if (activeEvent === 'moscas' && item.category === 'cafe') resolved = true;
      if (activeEvent === 'fuego' && item.id === 'pala') resolved = true;
      if (activeEvent === 'escape_lola' && item.id === 'cascaron') resolved = true;

      if (resolved) {
        let newTemp = prev.temperature;
        let newMoisture = Math.min(100, Math.max(0, prev.moisture + item.moistureEffect));
        let newPh = Math.min(14, Math.max(1, prev.ph + item.phEffect));
        let newGreens = prev.greens + (item.category === 'verde' ? 1 : 0);
        let newBrowns = prev.browns + (item.category === 'cafe' ? 1 : 0);

        if (item.id === 'pala') {
          newTemp = Math.max(20, newTemp - 35); // Ensure it drops well below 70
        } else if (item.category === 'verde' || item.category === 'cafe') {
          newTemp += 5;
        }

        const newState = {
           ...prev,
           activeEvent: null,
           score: prev.score + 50,
           temperature: newTemp,
           moisture: newMoisture,
           ph: newPh,
           greens: newGreens,
           browns: newBrowns,
           compostItems: item.category !== 'especial' ? [...prev.compostItems, item] : prev.compostItems
        };

        triggerMessage('¡Bien hecho Guardián! Has salvado la composta.', 'beto');
        return updateObjectives(newState, item, true);
      } else {
        triggerMessage('Eso no parece funcionar... Sigue las instrucciones del panel.', 'beto', true);
        return prev;
      }
    });
  };

  useEffect(() => {
    if (state.activeEvent || state.isEvaluating || state.isLevelComplete || state.level === 1) return;

    if (state.level === 2 && state.temperature > 70) {
        triggerEvent('fuego');
    }

    if (state.compostItems.length > 0 && state.compostItems.length % 5 === 0 && !state.activeEvent && !state.isLevelComplete) {
       let events: EventType[] = [];
       if (state.level === 2) {
           events = ['tormenta', 'hormigas', 'fuego']; 
       } else if (state.level >= 3) {
           events = ['tormenta', 'hormigas', 'fuego', 'escape_lola'];
       }
       if (events.length > 0) {
           const randomEvent = events[Math.floor(Math.random() * events.length)];
           triggerEvent(randomEvent);
       }
    }
  }, [state.temperature, state.compostItems.length, state.activeEvent, state.isEvaluating, state.isLevelComplete, state.level]);

  const requestEvaluation = () => setState(prev => ({ ...prev, isEvaluating: true }));

  const completeEvaluation = (success: boolean) => {
      if (success) {
          if (state.level === 4) {
              triggerMessage('¡Felicidades, Maestro de la Tierra! Has creado vida para el suelo. Tu Oro Verde está listo.', 'lola');
              setState(prev => ({ ...prev, isEvaluating: false, score: prev.score + 500, isLevelComplete: false }));
              return;
          }

          if (state.level === 2 && state.mode === 'balcon') {
              setState(prev => ({ ...prev, isEvaluating: false, isSurvivalTestActive: true, isLevelComplete: false }));
              return;
          }

          setState(prev => ({ 
              ...prev, 
              isEvaluating: false, 
              isLevelComplete: false,
              level: prev.level + 1,
              score: prev.score + 100,
              compostItems: [], 
              greens: 0,
              browns: 0,
              hasReachedThermophilic: false,
              objectives: getLevelObjectives(prev.level + 1, prev.mode!),
          }));
          
          if (state.level === 1) {
              triggerMessage('¡Nivel 2! El Puente Biotecnológico. Añade verdes y cafés hasta llegar a 55°C.', 'beto');
          } else if (state.level === 2) {
              triggerMessage('¡Seguimos! La composta tradicional tarda más meses. Sigue añadiendo equilibrio.', 'beto');
          } else if (state.level === 3) {
              triggerMessage('¡Nivel 4! El Oro Verde. ¡Casi terminamos!', 'lola');
          }
      } else {
          setState(prev => ({ ...prev, isEvaluating: false }));
          triggerMessage('¡Sigue intentándolo! Revisa los materiales e inténtalo de nuevo.', 'beto');
      }
  };

  const completeSurvivalTest = (success: boolean) => {
      if (success) {
          setState(prev => ({ 
              ...prev, 
              isSurvivalTestActive: false, 
              level: 3,
              score: prev.score + 200,
              compostItems: [],
              greens: 0,
              browns: 0,
              hasReachedThermophilic: false,
              objectives: getLevelObjectives(3, prev.mode!),
          }));
          triggerMessage('¡Nivel 3! Criadero de Lombrices. El material está fresco y listo para Lola.', 'lola');
      }
  };

  const restartLevel = () => {
    setState(prev => ({
      ...prev,
      compostItems: [],
      greens: 0,
      browns: 0,
      moisture: 50,
      temperature: 20,
      ph: 7,
      activeEvent: null,
      isEvaluating: false,
      isLevelComplete: false,
      hasReachedThermophilic: false,
      objectives: getLevelObjectives(prev.level, prev.mode!),
    }));
    triggerMessage('Hemos limpiado la composta para que vuelvas a intentar.', 'beto');
  };

  const resetGame = () => {
    setState(INITIAL_STATE);
  };

  return {
    state,
    setMode,
    addItem,
    clearMessage,
    requestEvaluation,
    completeEvaluation,
    completeSurvivalTest,
    restartLevel,
    resetGame,
    setFistTest: (active: boolean) => setState(prev => ({ ...prev, isFistTestActive: active })),
  };
}
