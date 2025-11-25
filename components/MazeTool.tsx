import React, { useState, useEffect, useRef } from 'react';
import { Settings, Image as ImageIcon, Download, Printer, RefreshCw, Eye, EyeOff, Upload } from 'lucide-react';
import { generateMaze } from '../services/mazeGenerator';
import { MazeState } from '../types';

const MazeTool: React.FC = () => {
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(20);
  const [showSolution, setShowSolution] = useState(false);
  const [startImage, setStartImage] = useState<string | null>(null);
  const [endImage, setEndImage] = useState<string | null>(null);
  const [maze, setMaze] = useState<MazeState | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = () => {
    const newMaze = generateMaze(width, height);
    setMaze(newMaze);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'start') setStartImage(url);
      else setEndImage(url);
    }
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw Logic
  useEffect(() => {
    if (!maze || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 30; // Base cell size
    const wallThickness = 2;
    const padding = 20;

    canvas.width = (maze.width * cellSize) + (padding * 2);
    canvas.height = (maze.height * cellSize) + (padding * 2);

    // Clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(padding, padding);

    // Draw Solution (if enabled)
    if (showSolution) {
      ctx.beginPath();
      ctx.strokeStyle = "#ef4444"; // Red solution path
      ctx.lineWidth = cellSize / 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      maze.solution.forEach((point, index) => {
        const px = (point.x * cellSize) + (cellSize / 2);
        const py = (point.y * cellSize) + (cellSize / 2);
        if (index === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Draw Walls
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = wallThickness;
    ctx.lineCap = "square";

    maze.grid.forEach(row => {
      row.forEach(cell => {
        const x = cell.x * cellSize;
        const y = cell.y * cellSize;

        ctx.beginPath();
        // Top
        if (cell.walls.top) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y);
        }
        // Right
        if (cell.walls.right) {
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x + cellSize, y + cellSize);
        }
        // Bottom
        if (cell.walls.bottom) {
          ctx.moveTo(x, y + cellSize);
          ctx.lineTo(x + cellSize, y + cellSize);
        }
        // Left
        if (cell.walls.left) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellSize);
        }
        ctx.stroke();
      });
    });

    // Draw Images
    const drawImage = (imgUrl: string | null, x: number, y: number) => {
      if (!imgUrl) return;
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        // Redraw context if images load late
        ctx.drawImage(img, x * cellSize + 4, y * cellSize + 4, cellSize - 8, cellSize - 8);
      };
      // Try immediate draw if cached
      if (img.complete) {
        ctx.drawImage(img, x * cellSize + 4, y * cellSize + 4, cellSize - 8, cellSize - 8);
      }
    };

    // Always draw start/end markers text if no image
    if (!startImage) {
      ctx.fillStyle = "#22c55e"; // Green start
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("S", (cellSize/2), (cellSize/2));
    } else {
      drawImage(startImage, 0, 0);
    }

    if (!endImage) {
      ctx.fillStyle = "#ef4444"; // Red end
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("E", ((maze.width-1) * cellSize) + (cellSize/2), ((maze.height-1) * cellSize) + (cellSize/2));
    } else {
      drawImage(endImage, maze.width - 1, maze.height - 1);
    }

  }, [maze, showSolution, startImage, endImage]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `maze-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Controls */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 no-print">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg">Maze Settings</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-1">Width (5-50)</label>
              <input 
                type="number" 
                min={5} 
                max={50} 
                value={width}
                onChange={(e) => setWidth(Math.max(5, Math.min(50, parseInt(e.target.value) || 20)))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-1">Height (5-50)</label>
              <input 
                type="number" 
                min={5} 
                max={50} 
                value={height}
                onChange={(e) => setHeight(Math.max(5, Math.min(50, parseInt(e.target.value) || 20)))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4 mb-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <ImageIcon className="w-4 h-4" /> Start Image
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 w-full text-center text-sm text-slate-600 transition-colors">
                  <Upload className="w-4 h-4 inline mr-2" />
                  {startImage ? 'Change Image' : 'Upload Start Icon'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'start')} />
                </label>
                {startImage && (
                  <button onClick={() => setStartImage(null)} className="text-red-500 hover:text-red-700 text-xs px-2">Clear</button>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <ImageIcon className="w-4 h-4" /> Goal Image
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 w-full text-center text-sm text-slate-600 transition-colors">
                  <Upload className="w-4 h-4 inline mr-2" />
                  {endImage ? 'Change Image' : 'Upload Goal Icon'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'end')} />
                </label>
                {endImage && (
                  <button onClick={() => setEndImage(null)} className="text-red-500 hover:text-red-700 text-xs px-2">Clear</button>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Maze</span>
          </button>
        </div>
      </div>

      {/* Display */}
      <div className="lg:col-span-8 xl:col-span-9">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[600px]">
          
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50 no-print">
            <h3 className="font-semibold text-slate-800">Preview</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSolution(!showSolution)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  showSolution 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {showSolution ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>

              <div className="h-6 w-px bg-slate-300 mx-1"></div>

              <button 
                onClick={() => window.print()}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title="Print Maze"
              >
                <Printer className="w-5 h-5" />
              </button>
              
              <button 
                onClick={downloadImage}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 flex flex-col items-center justify-center bg-slate-50/50 print:bg-white print:p-0">
             <div className="hidden print-only mb-6 text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Maze Challenge</h1>
              <p className="text-slate-500">Find your way from Start to Goal</p>
            </div>
            
            <canvas 
              ref={canvasRef} 
              className="max-w-full shadow-lg border border-slate-200 bg-white print:shadow-none print:border-none"
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default MazeTool;