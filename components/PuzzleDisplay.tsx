import React, { useRef } from 'react';
import { PuzzleState } from '../types';
import { Eye, EyeOff, Printer, Download, Copy, AlertCircle } from 'lucide-react';
import { copyPuzzleToClipboard, downloadPuzzleImage } from '../utils/exportUtils';

interface PuzzleDisplayProps {
  puzzle: PuzzleState;
  showAnswers: boolean;
  setShowAnswers: (val: boolean) => void;
}

const PuzzleDisplay: React.FC<PuzzleDisplayProps> = ({ puzzle, showAnswers, setShowAnswers }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50 no-print">
        <h3 className="font-semibold text-slate-800">Preview</h3>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showAnswers 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {showAnswers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>

          <div className="h-6 w-px bg-slate-300 mx-1"></div>

          <button 
            onClick={() => window.print()}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Print Puzzle"
          >
            <Printer className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => copyPuzzleToClipboard(puzzle)}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Copy as Text"
          >
            <Copy className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => downloadPuzzleImage(puzzle, showAnswers)}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Download Image"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Warnings */}
      {puzzle.unplacedWords.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-start gap-3 no-print">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">Some words couldn't be placed:</span>{' '}
            {puzzle.unplacedWords.join(', ')}. Try increasing the grid size.
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="flex-1 overflow-auto p-8 flex justify-center items-start bg-slate-50/50 print:bg-white print:p-0">
        <div ref={gridRef} className="print-break-inside-avoid">
          {/* Print Header */}
          <div className="hidden print-only mb-6 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Word Search</h1>
            <p className="text-slate-500">Find the hidden words</p>
          </div>

          <div 
            className="grid gap-px bg-slate-200 border-2 border-slate-800 p-1 select-none"
            style={{ 
              gridTemplateColumns: `repeat(${puzzle.grid[0].length}, minmax(1.5rem, 1fr))`,
            }}
          >
            {puzzle.grid.map((row, y) => (
              row.map((cell, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`
                    w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center font-mono text-sm sm:text-lg font-bold
                    ${showAnswers && cell.isPartOfWord 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'bg-white text-slate-800'}
                  `}
                >
                  {cell.letter}
                </div>
              ))
            ))}
          </div>

          {/* Word List for Print Layout (Placed below grid in print) */}
          <div className="hidden print-only mt-8">
            <h2 className="font-bold text-xl mb-4 text-slate-900">Word List</h2>
            <ul className="columns-3 gap-8">
              {puzzle.placedWords.map((word, idx) => (
                <li key={idx} className="mb-2 text-slate-700 text-lg">{word.word}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Screen-only Word List */}
      <div className="border-t border-slate-200 p-6 bg-white no-print max-h-[200px] overflow-y-auto">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Words to Find</h4>
        <div className="flex flex-wrap gap-2">
          {puzzle.placedWords.map((word, idx) => (
            <span 
              key={idx} 
              className={`
                px-3 py-1 rounded-full text-sm border
                ${showAnswers 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'}
              `}
            >
              {word.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PuzzleDisplay;
