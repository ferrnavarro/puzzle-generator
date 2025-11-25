import { MazeCell, MazeState } from '../types';

export const generateMaze = (width: number, height: number): MazeState => {
  // Initialize grid with all walls present
  const grid: MazeCell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      });
    }
    grid.push(row);
  }

  // Recursive Backtracker Algorithm
  const stack: MazeCell[] = [];
  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current, grid, width, height);

    if (neighbors.length > 0) {
      // Choose random neighbor
      const { neighbor, direction } = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Remove walls
      removeWall(current, neighbor, direction);
      
      neighbor.visited = true;
      stack.push(neighbor);
    } else {
      stack.pop();
    }
  }

  // Solve the maze to find the solution path
  const solution = solveMaze(grid, width, height);

  return {
    grid,
    width,
    height,
    solution
  };
};

const getUnvisitedNeighbors = (cell: MazeCell, grid: MazeCell[][], width: number, height: number) => {
  const neighbors = [];
  const { x, y } = cell;

  // Top
  if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ neighbor: grid[y - 1][x], direction: 'top' });
  // Right
  if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push({ neighbor: grid[y][x + 1], direction: 'right' });
  // Bottom
  if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push({ neighbor: grid[y + 1][x], direction: 'bottom' });
  // Left
  if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ neighbor: grid[y][x - 1], direction: 'left' });

  return neighbors;
};

const removeWall = (current: MazeCell, neighbor: MazeCell, direction: string) => {
  if (direction === 'top') {
    current.walls.top = false;
    neighbor.walls.bottom = false;
  } else if (direction === 'right') {
    current.walls.right = false;
    neighbor.walls.left = false;
  } else if (direction === 'bottom') {
    current.walls.bottom = false;
    neighbor.walls.top = false;
  } else if (direction === 'left') {
    current.walls.left = false;
    neighbor.walls.right = false;
  }
};

// BFS to find shortest path
const solveMaze = (grid: MazeCell[][], width: number, height: number): { x: number; y: number }[] => {
  const queue: { cell: MazeCell; path: { x: number; y: number }[] }[] = [];
  const visited = new Set<string>();
  
  queue.push({ cell: grid[0][0], path: [{ x: 0, y: 0 }] });
  visited.add("0,0");

  while (queue.length > 0) {
    const { cell, path } = queue.shift()!;
    
    // Check if reached end
    if (cell.x === width - 1 && cell.y === height - 1) {
      return path;
    }

    const { x, y } = cell;
    
    // Check accessible neighbors (no walls between)
    // Top
    if (!cell.walls.top && y > 0 && !visited.has(`${x},${y-1}`)) {
      visited.add(`${x},${y-1}`);
      queue.push({ cell: grid[y-1][x], path: [...path, { x, y: y-1 }] });
    }
    // Right
    if (!cell.walls.right && x < width - 1 && !visited.has(`${x+1},${y}`)) {
      visited.add(`${x+1},${y}`);
      queue.push({ cell: grid[y][x+1], path: [...path, { x: x+1, y }] });
    }
    // Bottom
    if (!cell.walls.bottom && y < height - 1 && !visited.has(`${x},${y+1}`)) {
      visited.add(`${x},${y+1}`);
      queue.push({ cell: grid[y+1][x], path: [...path, { x, y: y+1 }] });
    }
    // Left
    if (!cell.walls.left && x > 0 && !visited.has(`${x-1},${y}`)) {
      visited.add(`${x-1},${y}`);
      queue.push({ cell: grid[y][x-1], path: [...path, { x: x-1, y }] });
    }
  }
  
  return [];
};