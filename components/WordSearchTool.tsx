import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import PuzzleDisplay from './PuzzleDisplay';
import { generatePuzzle } from '../services/puzzleGenerator';
import { PuzzleState } from '../types';

const INITIAL_WORDS = `REACT
TYPESCRIPT
TAILWIND
COMPONENT
HOOKS
FRONTEND
DESIGN
DEVELOPER`;

const WordSearchTool: React.FC = () => {
  const [wordsInput, setWordsInput] = useState(INITIAL_WORDS);
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [showAnswers, setShowAnswers] = useState(false);
  const [puzzleData, setPuzzleData] = useState<PuzzleState | null>(null);

  const handleGenerate = () => {
    // Parse words from textarea
    const wordsList = wordsInput
      .split(/[\n,]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (wordsList.length === 0) {
      alert("Please enter at least one word.");
      return;
    }

    const newPuzzle = generatePuzzle(wordsList, cols, rows);
    setPuzzleData(newPuzzle);
    setShowAnswers(false); // Reset answer view on new generation
  };

  // Initial generation on mount
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Controls */}
      <div className="lg:col-span-4 xl:col-span-3 sticky top-24">
        <Controls 
          words={wordsInput}
          setWords={setWordsInput}
          rows={rows}
          cols={cols}
          setRows={setRows}
          setCols={setCols}
          onGenerate={handleGenerate}
        />
      </div>

      {/* Right: Puzzle Display */}
      <div className="lg:col-span-8 xl:col-span-9 min-h-[600px]">
        {puzzleData ? (
          <PuzzleDisplay 
            puzzle={puzzleData}
            showAnswers={showAnswers}
            setShowAnswers={setShowAnswers}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Generate a puzzle to begin
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSearchTool;