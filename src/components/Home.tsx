import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PRESET_EXERCISES, BreathingExercise } from '../types';

interface HomeProps {
  onStartExercise: (exercise: BreathingExercise) => void;
  onOpenBuilder: () => void;
}

export default function Home({ onStartExercise, onOpenBuilder }: HomeProps) {
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    const storedSessions = localStorage.getItem('breathflow_sessions');
    const storedSeconds = localStorage.getItem('breathflow_seconds');
    if (storedSessions) setTotalSessions(parseInt(storedSessions, 10));
    if (storedSeconds) setTotalMinutes(Math.floor(parseInt(storedSeconds, 10) / 60));
  }, []);

  return (
    <div className="flex-1 w-full max-w-xl mx-auto px-6 py-12 flex flex-col fade-in">
      <div className="mb-12 mt-8 text-center sm:text-left">
        <h1 className="text-3xl font-light tracking-tighter" style={{ fontFamily: "var(--font-serif)" }}>BreathFlow</h1>
        <p className="text-xs opacity-40 uppercase tracking-widest mt-1">Sanctuary for Focus</p>
      </div>

      {totalSessions > 0 && (
        <div className="glass-card mb-10 flex space-x-12 justify-center sm:justify-start">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Sessions</p>
            <p className="text-2xl font-light">{totalSessions}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Mindful Mins</p>
            <p className="text-2xl font-light">{totalMinutes}</p>
          </div>
        </div>
      )}

      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4 text-center sm:text-left">Guided Rhythms</p>
        <div className="space-y-1">
          {PRESET_EXERCISES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onStartExercise(preset)}
              className="exercise-pill group"
            >
              <div className="text-left">
                <div className="text-sm font-medium">{preset.name}</div>
                <div className="text-[10px] opacity-50 uppercase mt-1">
                  {preset.pattern.map(p => p.duration).join(' - ')} • {preset.description.split('.')[0]}
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
          
          <button
            onClick={onOpenBuilder}
            className="exercise-pill group border border-dashed border-white/10 hover:border-white/30 !mt-4"
          >
            <div className="text-left">
              <div className="text-sm font-medium text-gray-300">Custom Timer</div>
              <div className="text-[10px] opacity-50 uppercase mt-1">Build your own flow</div>
            </div>
            <Plus size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
