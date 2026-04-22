/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Home from './components/Home';
import Session from './components/Session';
import CustomBuilder from './components/CustomBuilder';
import { BreathingExercise } from './types';

export type AppState = 'home' | 'session' | 'builder';

export default function App() {
  const [currentView, setCurrentView] = useState<AppState>('home');
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setCurrentView('session');
  };

  const navigateHome = () => {
    setSelectedExercise(null);
    setCurrentView('home');
  };

  return (
    <div className="relative min-h-screen">
      <div className="atmosphere"></div>
      
      <main className="relative z-10 flex flex-col min-h-screen">
        {currentView === 'home' && (
          <Home 
            onStartExercise={startExercise} 
            onOpenBuilder={() => setCurrentView('builder')} 
          />
        )}
        
        {currentView === 'session' && selectedExercise && (
          <Session 
            exercise={selectedExercise} 
            onEnd={navigateHome} 
          />
        )}

        {currentView === 'builder' && (
          <CustomBuilder 
            onCancel={navigateHome}
            onStart={startExercise}
          />
        )}
      </main>
    </div>
  );
}
