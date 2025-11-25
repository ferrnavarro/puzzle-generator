export interface Cell {
  letter: string;
  x: number;
  y: number;
  isPartOfWord: boolean;
  wordColors?: string[]; // IDs of words this cell belongs to (for overlapping highlights)
}

export interface PlacedWord {
  word: string;
  cleanWord: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

export interface PuzzleConfig {
  width: number;
  height: number;
  words: string[];
}

export interface PuzzleState {
  grid: Cell[][];
  placedWords: PlacedWord[];
  unplacedWords: string[];
  generatedAt: number;
}

// Maze Types

export interface MazeCell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export interface MazeState {
  grid: MazeCell[][];
  width: number;
  height: number;
  solution: { x: number; y: number }[]; // Array of coordinates from start to end
}

export interface MazeImages {
  start: string | null; // Object URL
  end: string | null;   // Object URL
}