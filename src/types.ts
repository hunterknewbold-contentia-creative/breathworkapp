export interface BreathingPhase {
  name: "Inhale" | "Hold" | "Exhale";
  duration: number; // in seconds
}

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  pattern: BreathingPhase[];
  defaultCycles: number;
}

export const PRESET_EXERCISES: BreathingExercise[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Focus and calm. Equal parts inhale, hold, exhale, and hold.",
    pattern: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 4 },
      { name: "Exhale", duration: 4 },
      { name: "Hold", duration: 4 },
    ],
    defaultCycles: 5,
  },
  {
    id: "relax",
    name: "4-7-8 Breathing",
    description: "Sleep and relaxation. A natural tranquilizer for the nervous system.",
    pattern: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 7 },
      { name: "Exhale", duration: 8 },
    ],
    defaultCycles: 4,
  },
  {
    id: "diaphragmatic",
    name: "Belly Breathing",
    description: "Stress reduction and general wellness.",
    pattern: [
      { name: "Inhale", duration: 4 },
      { name: "Exhale", duration: 6 },
    ],
    defaultCycles: 10,
  },
  {
    id: "pursed-lip",
    name: "Pursed-Lip Breathing",
    description: "Controlled breathing and relaxation.",
    pattern: [
      { name: "Inhale", duration: 2 },
      { name: "Exhale", duration: 4 },
    ],
    defaultCycles: 10,
  },
];
