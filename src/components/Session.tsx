import React, { useState, useEffect, useRef } from 'react';
import { BreathingExercise } from '../types';
import { toneFeature } from '../services/audio';
import { X, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface SessionProps {
  exercise: BreathingExercise;
  onEnd: () => void;
}

export default function Session({ exercise, onEnd }: SessionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeftInPhase, setTimeLeftInPhase] = useState(exercise.pattern[0].duration);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activePhase = exercise.pattern[currentPhaseIndex];
  const nextPhase = exercise.pattern[(currentPhaseIndex + 1) % exercise.pattern.length];

  const getScale = (phaseName: string) => {
    switch (phaseName) {
      case 'Inhale': return 1.3;
      case 'Exhale': return 0.7;
      case 'Hold': return currentPhaseIndex > 0 && exercise.pattern[currentPhaseIndex - 1].name === 'Inhale' ? 1.3 : 0.7;
      default: return 1;
    }
  };

  useEffect(() => {
    if (audioEnabled && isPlaying && !isFinished) toneFeature.play();
    else toneFeature.stop();
    return () => toneFeature.stop();
  }, [audioEnabled, isPlaying, isFinished]);

  useEffect(() => {
    if (!isPlaying || isFinished) return;
    timerRef.current = setInterval(() => {
      setTimeLeftInPhase((prev) => {
        if (prev > 1) return prev - 1;
        const nextIndex = currentPhaseIndex + 1;
        if (nextIndex >= exercise.pattern.length) {
          if (currentCycle >= exercise.defaultCycles) {
            finishSession();
            return 0;
          } else {
            setCurrentCycle(c => c + 1);
            setCurrentPhaseIndex(0);
            return exercise.pattern[0].duration;
          }
        } else {
          setCurrentPhaseIndex(nextIndex);
          return exercise.pattern[nextIndex].duration;
        }
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, currentPhaseIndex, currentCycle, exercise.pattern, exercise.defaultCycles, isFinished]);

  const finishSession = () => {
    setIsFinished(true);
    setIsPlaying(false);
    const storedSessions = localStorage.getItem('breathflow_sessions') || '0';
    const storedSeconds = localStorage.getItem('breathflow_seconds') || '0';
    const sessionSeconds = exercise.pattern.reduce((acc, p) => acc + p.duration, 0) * exercise.defaultCycles;
    localStorage.setItem('breathflow_sessions', (parseInt(storedSessions, 10) + 1).toString());
    localStorage.setItem('breathflow_seconds', (parseInt(storedSeconds, 10) + sessionSeconds).toString());
  };

  const handleEnd = () => {
    toneFeature.stop();
    onEnd();
  };

  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-screen fade-in">
        <div className="glass-card flex flex-col items-center p-12 max-w-sm w-full">
          <h2 className="text-3xl font-light mb-8" style={{ fontFamily: "var(--font-serif)" }}>Session Complete</h2>
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">You completed</p>
          <div className="text-2xl font-light mb-6">{exercise.name}</div>
          <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-12">{currentCycle} Cycles</p>
          <button onClick={handleEnd} className="w-full py-4 rounded-full border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden fade-in relative">
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 text-[10px] tracking-[0.4em] uppercase opacity-30 z-20">
        Session Active
      </div>

      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 flex gap-3 sm:gap-4 z-20">
        <button onClick={() => setAudioEnabled(!audioEnabled)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${audioEnabled ? 'border border-blue-400/50 bg-blue-400/10 text-blue-400' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>
          {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-colors">
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
        </button>
        <button onClick={handleEnd} className="hidden sm:flex px-6 py-2 rounded-full border border-white/20 text-[10px] uppercase justify-center items-center tracking-widest hover:bg-white hover:text-black transition-colors">
          End Session
        </button>
        <button onClick={handleEnd} className="w-10 h-10 sm:hidden rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full h-full relative z-10">
        <div className="breath-circle-outer">
          <motion.div
            className="breath-circle-inner"
            animate={{ 
              scale: isPlaying ? getScale(activePhase.name) : 1,
              opacity: isPlaying ? 1 : 0.8
            }}
            transition={{ 
              duration: isPlaying ? (activePhase.name === 'Hold' ? 0.4 : activePhase.duration) : 0.5,
              ease: "easeInOut"
            }}
          >
            <span className="timer-text">{timeLeftInPhase}</span>
            <span className="phase-text">{activePhase.name}</span>
          </motion.div>
          <div className="absolute inset-0 border border-white/10 rounded-full scale-[1.1] sm:scale-110 opacity-20 pointer-events-none"></div>
          <div className="absolute inset-0 border border-white/5 rounded-full scale-[1.2] sm:scale-[1.25] opacity-10 pointer-events-none"></div>
        </div>
        
        <div className="absolute bottom-12 flex gap-8 sm:gap-12 justify-center w-full">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Cycle</p>
            <p className="text-xl font-light">{String(currentCycle).padStart(2, '0')}<span className="opacity-30">/{String(exercise.defaultCycles).padStart(2, '0')}</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Next Phase</p>
            <p className="text-xl font-light text-base mt-2">{nextPhase.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
