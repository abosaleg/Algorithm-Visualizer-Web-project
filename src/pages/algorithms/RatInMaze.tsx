import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { VisualizationCanvas } from '@/components/visualization/VisualizationCanvas';
import { ControlPanel } from '@/components/visualization/ControlPanel';
import { ResultPanel } from '@/components/visualization/ResultPanel';
import { InputPanel, InputButton } from '@/components/visualization/InputPanel';
import { AlgorithmInfo } from '@/components/visualization/AlgorithmInfo';
import { useVisualization } from '@/hooks/useVisualization';
import { AlgorithmConfig, AlgorithmStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

const config: AlgorithmConfig = {
  id: 'rat-in-maze',
  name: 'Rat in a Maze',
  category: 'backtracking',
  description: 'Find a path from top-left to bottom-right in a maze using backtracking.',
  timeComplexity: 'O(2^(n²))',
  spaceComplexity: 'O(n²)',
  pseudocode: ['function solve(maze, x, y, path):', '  if (x,y) is destination: return true', '  if isValid(x, y):', '    path[x][y] = 1', '    if solve(maze, x+1, y, path): return true', '    if solve(maze, x, y+1, path): return true', '    path[x][y] = 0  // backtrack', '  return false'],
  useCases: ['Robot navigation', 'Game AI pathfinding', 'Puzzle solving'],
};

const maze = [[1,0,0,0],[1,1,0,1],[0,1,0,0],[1,1,1,1]];

function generateMazeSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;
  const n = maze.length;
  const path = Array(n).fill(null).map(() => Array(n).fill(0));
  const visited: {x: number; y: number}[] = [];

  function solve(x: number, y: number): boolean {
    if (x === n - 1 && y === n - 1 && maze[x][y] === 1) {
      path[x][y] = 1;
      visited.push({x, y});
      steps.push({ id: stepId++, description: `Reached destination!`, data: { maze, path: path.map(r => [...r]), current: {x, y}, visited: [...visited], isBacktracking: false }, isValid: true });
      return true;
    }
    if (x >= 0 && y >= 0 && x < n && y < n && maze[x][y] === 1 && path[x][y] === 0) {
      path[x][y] = 1;
      visited.push({x, y});
      steps.push({ id: stepId++, description: `Moving to (${x},${y})`, data: { maze, path: path.map(r => [...r]), current: {x, y}, visited: [...visited], isBacktracking: false }, isValid: true });
      if (solve(x + 1, y) || solve(x, y + 1)) return true;
      path[x][y] = 0;
      steps.push({ id: stepId++, description: `Backtracking from (${x},${y})`, data: { maze, path: path.map(r => [...r]), current: {x, y}, visited: [...visited], isBacktracking: true }, isValid: true });
    }
    return false;
  }

  steps.push({ id: stepId++, description: 'Starting maze solver', data: { maze, path: path.map(r => [...r]), current: null, visited: [], isBacktracking: false }, isValid: true });
  solve(0, 0);
  return steps;
}

export default function RatInMaze() {
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const steps = generateMazeSteps();
    setSteps(steps);
    setResult({ success: true, message: 'Path found!', timeComplexity: 'O(2^n²)', spaceComplexity: 'O(n²)', iterations: steps.length - 2 });
  }, [setSteps, setResult]);

  const mazeState = currentStepData?.data as any;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel title="Rat in Maze" description="Find path from (0,0) to (n-1,n-1)">
            <InputButton onClick={handleStart}>Find Path</InputButton>
          </InputPanel>
          <AlgorithmInfo config={config} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Maze" className="min-h-[400px]">
            {mazeState ? (
              <div className="grid grid-cols-4 gap-2">
                {maze.map((row, i) => row.map((cell, j) => {
                  const isPath = mazeState.path[i][j] === 1;
                  const isCurrent = mazeState.current?.x === i && mazeState.current?.y === j;
                  return (
                    <motion.div key={`${i}-${j}`} className={cn(
                      "w-16 h-16 rounded-lg flex items-center justify-center font-bold",
                      cell === 0 && "bg-muted/80",
                      cell === 1 && !isPath && "bg-card border border-border",
                      isPath && !isCurrent && "bg-neon-green/30 border border-neon-green",
                      isCurrent && !mazeState.isBacktracking && "bg-primary/50 border-2 border-primary",
                      isCurrent && mazeState.isBacktracking && "bg-neon-orange/50 border-2 border-neon-orange"
                    )}>{i === 0 && j === 0 ? '🐀' : i === 3 && j === 3 ? '🧀' : ''}</motion.div>
                  );
                }))}
              </div>
            ) : <p className="text-muted-foreground">Click Find Path to start</p>}
          </VisualizationCanvas>
          <ControlPanel isPlaying={state.isPlaying} isPaused={state.isPaused} currentStep={state.currentStep} totalSteps={state.totalSteps} speed={state.speed} onPlay={play} onPause={pause} onNextStep={nextStep} onPrevStep={prevStep} onReset={reset} onSpeedChange={setSpeed} disabled={state.totalSteps === 0} />
        </div>
        <div className="lg:col-span-1"><ResultPanel result={state.result} currentState={currentStepData?.description} /></div>
      </div>
    </Layout>
  );
}
