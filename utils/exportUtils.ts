import { PuzzleState } from "../types";

export const copyPuzzleToClipboard = (puzzle: PuzzleState) => {
  let text = "";
  puzzle.grid.forEach(row => {
    text += row.map(cell => cell.letter).join(" ") + "\n";
  });
  text += "\nWords to find:\n";
  text += puzzle.placedWords.map(w => w.word).join(", ");
  
  navigator.clipboard.writeText(text).then(() => {
    alert("Puzzle copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy: ", err);
    alert("Failed to copy to clipboard.");
  });
};

export const downloadPuzzleImage = (puzzle: PuzzleState, showSolution: boolean) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const CELL_SIZE = 40;
  const PADDING = 60;
  const HEADER_HEIGHT = 100;
  const WORD_LIST_WIDTH = 300;
  
  const gridWidth = puzzle.grid[0].length * CELL_SIZE;
  const gridHeight = puzzle.grid.length * CELL_SIZE;
  
  const totalWidth = gridWidth + (PADDING * 3) + WORD_LIST_WIDTH;
  const totalHeight = Math.max(gridHeight, 400) + HEADER_HEIGHT + (PADDING * 2);

  canvas.width = totalWidth;
  canvas.height = totalHeight;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 48px Inter, sans-serif";
  ctx.fillText("Word Search", PADDING, 70);
  
  ctx.fillStyle = "#64748b";
  ctx.font = "20px Inter, sans-serif";
  ctx.fillText(showSolution ? "Answer Key" : "Find the words hidden in the grid", PADDING, 100);

  // Draw Grid
  ctx.font = "24px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  puzzle.grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      const xPos = PADDING + (x * CELL_SIZE);
      const yPos = HEADER_HEIGHT + PADDING + (y * CELL_SIZE);

      // Highlight logic
      if (showSolution && cell.isPartOfWord) {
        ctx.fillStyle = "#e0e7ff"; // Light indigo background
        ctx.fillRect(xPos, yPos, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = "#4338ca"; // Indigo text
      } else {
        ctx.fillStyle = "#0f172a"; // Default text
      }
      
      // Cell Border (Light)
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(xPos, yPos, CELL_SIZE, CELL_SIZE);

      ctx.fillText(cell.letter, xPos + (CELL_SIZE / 2), yPos + (CELL_SIZE / 2));
    });
  });

  // Border around entire grid
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 2;
  ctx.strokeRect(PADDING, HEADER_HEIGHT + PADDING, gridWidth, gridHeight);

  // Draw Word List
  const listStartX = PADDING + gridWidth + PADDING;
  let listY = HEADER_HEIGHT + PADDING + 10;

  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 24px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Word List", listStartX, listY);
  listY += 40;

  ctx.font = "18px Inter, sans-serif";
  puzzle.placedWords.forEach(w => {
    ctx.fillText(w.word, listStartX, listY);
    listY += 30;
  });

  // Download
  const link = document.createElement('a');
  link.download = `word-search-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};
