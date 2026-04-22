import React, { useState } from 'react';
import { BreathingExercise, BreathingPhase } from '../types';
import { X, Trash2 } from 'lucide-react';

interface CustomBuilderProps {
  onCancel: () => void;
  onStart: (exercise: BreathingExercise) => void;
}

export default function CustomBuilder({ onCancel, onStart }: CustomBuilderProps) {
  const [phases, setPhases] = useState<BreathingPhase[]>([
    { name: 'Inhale', duration: 4 },
    { name: 'Exhale', duration: 4 }
  ]);
  const [cycles, setCycles] = useState(5);

  const addPhase = (name: 'Inhale' | 'Hold' | 'Exhale') => setPhases([...phases, { name, duration: 4 }]);
  const removePhase = (index: number) => {
    if (phases.length <= 1) return;
    setPhases(phases.filter((_, i) => i !== index));
  };
  const updateDuration = (index: number, delta: number) => {
    const newPhases = [...phases];
    newPhases[index].duration = Math.max(1, newPhases[index].duration + delta);
    setPhases(newPhases);
  };

  const handleStart = () => {
    onStart({
      id: 'custom-' + Date.now(),
      name: 'Custom Flow',
      description: 'Your personalized breathing pattern.',
      pattern: phases,
      defaultCycles: cycles
    });
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto px-6 py-12 flex flex-col h-screen fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light tracking-tighter" style={{ fontFamily: "var(--font-serif)" }}>Custom Timer</h2>
        <button onClick={onCancel} className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8 no-scrollbar">
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">The Pattern</label>
          
          {phases.map((phase, index) => (
            <div key={index} className="glass-card flex items-center justify-between !py-4 !px-5">
              <div className="flex-1">
                <span className="text-sm font-medium">{phase.name}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-black/40 rounded-full px-2 py-1 border border-white/5">
                  <button onClick={() => updateDuration(index, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white font-serif italic">-</button>
                  <span className="w-8 text-center font-mono tabular-nums text-sm opacity-80">{phase.duration}s</span>
                  <button onClick={() => updateDuration(index, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white font-serif italic">+</button>
                </div>
                
                <button 
                  onClick={() => removePhase(index)} 
                  className={`text-gray-500 hover:text-red-400 transition-colors ${phases.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={phases.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-center space-x-2 pt-2">
            <button onClick={() => addPhase('Inhale')} className="px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
              + Inhale
            </button>
            <button onClick={() => addPhase('Hold')} className="px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
              + Hold
            </button>
            <button onClick={() => addPhase('Exhale')} className="px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
              + Exhale
            </button>
          </div>
        </div>

        <div className="pt-4">
          <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">Cycles</label>
          <div className="glass-card flex items-center justify-between !py-4 !px-5">
            <span className="text-sm font-medium text-gray-300">Total Cycles</span>
            <div className="flex items-center bg-black/40 rounded-full px-2 py-1 border border-white/5">
              <button onClick={() => setCycles(Math.max(1, cycles - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white font-serif italic">-</button>
              <span className="w-8 text-center font-mono tabular-nums text-sm opacity-80">{cycles}</span>
              <button onClick={() => setCycles(cycles + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white font-serif italic">+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 pb-8">
        <button 
          onClick={handleStart}
          className="w-full py-4 rounded-full border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black text-[10px] uppercase tracking-widest font-bold transition-all shadow-[0_0_20px_rgba(96,165,250,0.15)] hover:shadow-[0_0_30px_rgba(96,165,250,0.4)]"
        >
          Begin Session
        </button>
      </div>

    </div>
  );
}
