import { GameShape, GameAnimal, GameColor } from './gameTypes';

export const shapes: GameShape[] = [
  { type: 'circle', color: '#FF6B6B', emoji: '🔴' },
  { type: 'square', color: '#4ECDC4', emoji: '🟦' },
  { type: 'triangle', color: '#45B7D1', emoji: '🔺' },
  { type: 'star', color: '#FFD700', emoji: '⭐' },
  { type: 'heart', color: '#FF69B4', emoji: '❤️' },
  { type: 'diamond', color: '#9B59B6', emoji: '💎' }
];

export const animals: GameAnimal[] = [
  { name: 'cat', emoji: '🐱' },
  { name: 'dog', emoji: '🐶' },
  { name: 'cow', emoji: '🐄' },
  { name: 'pig', emoji: '🐷' },
  { name: 'rabbit', emoji: '🐰' },
  { name: 'bear', emoji: '🐻' },
  { name: 'lion', emoji: '🦁' },
  { name: 'elephant', emoji: '🐘' },
  { name: 'duck', emoji: '🦆' },
  { name: 'frog', emoji: '🐸' }
];

export const colors: GameColor[] = [
  { name: 'red', hex: '#FF6B6B', emoji: '🔴' },
  { name: 'blue', hex: '#4ECDC4', emoji: '🔵' },
  { name: 'green', hex: '#96CEB4', emoji: '🟢' },
  { name: 'yellow', hex: '#FFD700', emoji: '🟡' },
  { name: 'purple', hex: '#9B59B6', emoji: '🟣' },
  { name: 'orange', hex: '#FF8C42', emoji: '🟠' },
  { name: 'pink', hex: '#FF69B4', emoji: '🩷' },
  { name: 'brown', hex: '#8B4513', emoji: '🤎' }
];

export const encouragingPhrases = [
  "Great job!",
  "Awesome!",
  "You're amazing!",
  "Fantastic!",
  "Well done!",
  "Super!",
  "Brilliant!",
  "Excellent!",
  "You did it!",
  "Perfect!"
];
