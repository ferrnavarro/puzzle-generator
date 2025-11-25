import { Cell, PlacedWord, PuzzleState } from '../types';

const DIRECTIONS = [
  { x: 1, y: 0 },   // Horizontal
  { x: 0, y: 1 },   // Vertical
  { x: 1, y: 1 },   // Diagonal Down-Right
];

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
];

// Helper to remove spaces and keep accents
export const cleanString = (str: string): string => {
  return str.trim().toUpperCase().replace(/\s+/g, '');
};

// Generate a random letter (A-Z)
const getRandomLetter = (): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const createEmptyGrid = (width: number, height: number): Cell[][] => {
  const grid: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        letter: '',
        isPartOfWord: false,
        wordColors: []
      });
    }
    grid.push(row);
  }
  return grid;
};

const canPlaceWord = (
  grid: Cell[][],
  word: string,
  startX: number,
  startY: number,
  dirX: number,
  dirY: number,
  width: number,
  height: number
): boolean => {
  for (let i = 0; i < word.length; i++) {
    const x = startX + (i * dirX);
    const y = startY + (i * dirY);

    // Check bounds
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return false;
    }

    // Check collision: Cell must be empty OR match the current letter
    const currentCell = grid[y][x];
    if (currentCell.letter !== '' && currentCell.letter !== word[i]) {
      return false;
    }
  }
  return true;
};

const placeWordOnGrid = (
  grid: Cell[][],
  word: string,
  originalWord: string,
  startX: number,
  startY: number,
  dirX: number,
  dirY: number,
  colorIndex: number
): PlacedWord => {
  const color = COLORS[colorIndex % COLORS.length];
  
  for (let i = 0; i < word.length; i++) {
    const x = startX + (i * dirX);
    const y = startY + (i * dirY);
    grid[y][x].letter = word[i];
    grid[y][x].isPartOfWord = true;
    grid[y][x].wordColors = [...(grid[y][x].wordColors || []), color];
  }

  return {
    word: originalWord,
    cleanWord: word,
    startX,
    startY,
    endX: startX + ((word.length - 1) * dirX),
    endY: startY + ((word.length - 1) * dirY),
    color
  };
};

export const generatePuzzle = (
  rawWords: string[],
  width: number,
  height: number
): PuzzleState => {
  // Sort words by length descending (hardest to place first)
  const processedWords = rawWords
    .map(w => ({ original: w.trim(), clean: cleanString(w) }))
    .filter(w => w.clean.length > 0)
    .sort((a, b) => b.clean.length - a.clean.length);

  let bestGrid: Cell[][] = [];
  let bestPlacedWords: PlacedWord[] = [];
  let bestUnplacedCount = Infinity;

  // Try to generate the grid multiple times to find the best fit
  const ATTEMPTS = 20;

  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const currentGrid = createEmptyGrid(width, height);
    const currentPlacedWords: PlacedWord[] = [];
    const currentUnplacedWords: string[] = [];

    for (let i = 0; i < processedWords.length; i++) {
      const { original, clean } = processedWords[i];
      
      // If word is longer than max dimension, it's impossible (ignoring diagonal hypotenuse for simplicity check)
      if (clean.length > Math.max(width, height)) {
        currentUnplacedWords.push(original);
        continue;
      }

      let placed = false;
      const placementAttempts = 100;

      for (let p = 0; p < placementAttempts; p++) {
        const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const startX = Math.floor(Math.random() * width);
        const startY = Math.floor(Math.random() * height);

        if (canPlaceWord(currentGrid, clean, startX, startY, dir.x, dir.y, width, height)) {
          const placedWord = placeWordOnGrid(
            currentGrid,
            clean,
            original,
            startX,
            startY,
            dir.x,
            dir.y,
            i
          );
          currentPlacedWords.push(placedWord);
          placed = true;
          break;
        }
      }

      if (!placed) {
        currentUnplacedWords.push(original);
      }
    }

    if (currentUnplacedWords.length < bestUnplacedCount) {
      bestUnplacedCount = currentUnplacedWords.length;
      bestGrid = currentGrid;
      bestPlacedWords = currentPlacedWords;
    }

    if (bestUnplacedCount === 0) break; // Perfect run
  }

  // Fill empty spots with random letters
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (bestGrid[y][x].letter === '') {
        bestGrid[y][x].letter = getRandomLetter();
      }
    }
  }

  // Identify unplaced words from the best run
  const placedCleanWords = new Set(bestPlacedWords.map(pw => pw.cleanWord));
  const unplacedWords = processedWords
    .filter(w => !placedCleanWords.has(w.clean))
    .map(w => w.original);

  return {
    grid: bestGrid,
    placedWords: bestPlacedWords,
    unplacedWords,
    generatedAt: Date.now()
  };
};
