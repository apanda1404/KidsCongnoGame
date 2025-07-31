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

// New game assets for pattern matching
export const patterns = [
  { id: 'circle-square', pattern: ['🔴', '🟦'], name: 'Circle-Square' },
  { id: 'star-heart', pattern: ['⭐', '❤️'], name: 'Star-Heart' },
  { id: 'triangle-diamond', pattern: ['🔺', '💎'], name: 'Triangle-Diamond' },
  { id: 'sun-moon', pattern: ['☀️', '🌙'], name: 'Sun-Moon' },
  { id: 'flower-tree', pattern: ['🌸', '🌳'], name: 'Flower-Tree' }
];

// Memory game items
export const memoryItems = [
  { id: 'apple', emoji: '🍎', name: 'Apple' },
  { id: 'banana', emoji: '🍌', name: 'Banana' },
  { id: 'car', emoji: '🚗', name: 'Car' },
  { id: 'house', emoji: '🏠', name: 'House' },
  { id: 'ball', emoji: '⚽', name: 'Ball' },
  { id: 'book', emoji: '📚', name: 'Book' },
  { id: 'cake', emoji: '🎂', name: 'Cake' },
  { id: 'flower', emoji: '🌸', name: 'Flower' }
];

// Matching pairs for the matching game
export const matchingPairs = [
  { id: 'fruit', items: [{ emoji: '🍎', name: 'Apple' }, { emoji: '🍌', name: 'Banana' }], category: 'Fruits' },
  { id: 'transport', items: [{ emoji: '🚗', name: 'Car' }, { emoji: '✈️', name: 'Plane' }], category: 'Transport' },
  { id: 'animals', items: [{ emoji: '🐱', name: 'Cat' }, { emoji: '🐶', name: 'Dog' }], category: 'Animals' },
  { id: 'nature', items: [{ emoji: '🌸', name: 'Flower' }, { emoji: '🌳', name: 'Tree' }], category: 'Nature' },
  { id: 'food', items: [{ emoji: '🍕', name: 'Pizza' }, { emoji: '🎂', name: 'Cake' }], category: 'Food' }
];
