import React, { useState } from 'react';
import { Gamepad2, Puzzle, Spline } from 'lucide-react';
import WordSearchTool from './components/WordSearchTool';
import MazeTool from './components/MazeTool';

type Tool = 'wordsearch' | 'maze';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('wordsearch');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-10 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Puzzle<span className="text-indigo-600">Generator</span>
            </h1>
          </div>
          
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTool('wordsearch')}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all
                ${activeTool === 'wordsearch' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}
              `}
            >
              <Puzzle className="w-4 h-4" />
              Word Search
            </button>
            <button
              onClick={() => setActiveTool('maze')}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all
                ${activeTool === 'maze' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}
              `}
            >
              <Spline className="w-4 h-4" />
              Maze Generator
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTool === 'wordsearch' ? <WordSearchTool /> : <MazeTool />}
      </main>

    </div>
  );
};

export default App;