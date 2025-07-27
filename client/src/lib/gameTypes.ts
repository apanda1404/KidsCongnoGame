export interface GameShape {
  type: string;
  color: string;
  emoji: string;
}

export interface GameAnimal {
  name: string;
  emoji: string;
}

export interface GameColor {
  name: string;
  hex: string;
  emoji: string;
}

export interface GameLevel {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  maxItems: number;
}
