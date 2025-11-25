import React from 'react';
import { Settings, Grid3X3, List } from 'lucide-react';

interface ControlsProps {
  words: string;
  setWords: (words: string) => void;
  rows: number;
  cols: number;
  setRows: (val: number) => void;
  setCols: (val: number) => void;
  onGenerate: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  words,
  setWords,
  rows,
  cols,
  setRows,
  setCols,
  onGenerate,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col gap-6 no-print">
      
      <div>
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-lg">Configuration</h2>
        </div>

        {/* Grid Size Controls */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
            <Grid3X3 className="w-4 h-4" />
            <span>Grid Dimensions</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-1">Width (10-30)</label>
              <input 
                type="number" 
                min={10} 
                max={30} 
                value={cols}
                onChange={(e) => setCols(Math.max(10, Math.min(30, parseInt(e.target.value) || 20)))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-1">Height (10-30)</label>
              <input 
                type="number" 
                min={10} 
                max={30} 
                value={rows}
                onChange={(e) => setRows(Math.max(10, Math.min(30, parseInt(e.target.value) || 20)))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Word Input */}
        <div className="flex-1 flex flex-col min-h-[200px]">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
            <List className="w-4 h-4" />
            <span>Words to Hide</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">Enter one word per line or comma separated.</p>
          <textarea 
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="REACT&#10;TYPESCRIPT&#10;TAILWIND&#10;PUZZLE&#10;GENERATOR"
            className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-mono text-sm resize-none"
          />
        </div>
      </div>

      <button 
        onClick={onGenerate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
      >
        <span>Generate Puzzle</span>
      </button>

    </div>
  );
};

export default Controls;
