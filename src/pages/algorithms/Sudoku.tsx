import { useState, useCallback } from 'react';
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
  id: 'sudoku',
  name: 'Sudoku Solver',
  category: 'backtracking',
  description: 'Solve a 9x9 Sudoku puzzle using backtracking. Try placing numbers 1-9, backtrack when constraints are violated.',
  timeComplexity: 'O(9^(n²))',
  spaceComplexity: 'O(n²)',
  pseudocode: [
    'function solveSudoku(board):',
    '  cell = findEmpty(board)',
    '  if cell is null: return true',
    '  for num from 1 to 9:',
    '    if isValid(board, cell, num):',
    '      board[cell] = num',
    '      if solveSudoku(board): return true',
    '      board[cell] = 0  // backtrack',
    '  return false',
  ],
  useCases: ['Constraint satisfaction', 'Puzzle solving', 'Logic games', 'AI problem solving'],
};

const initialBoard = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

interface SudokuState {
  board: number[][];
  currentCell: { row: number; col: number } | null;
  tryingValue: number;
  isValid: boolean;
  isBacktracking: boolean;
}

function generateSudokuSteps(board: number[][]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;
  const grid = board.map(row => [...row]);

  steps.push({ id: stepId++, description: 'Starting Sudoku solver', data: { board: grid.map(r => [...r]), currentCell: null, tryingValue: 0, isValid: true, isBacktracking: false }, isValid: true });

  function isValidPlacement(g: number[][], row: number, col: number, num: number): boolean {
    for (let x = 0; x < 9; x++) if (g[row][x] === num || g[x][col] === num) return false;
    const boxRow = Math.floor(row / 3) * 3, boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (g[boxRow + i][boxCol + j] === num) return false;
    return true;
  }

  function solve(g: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            const valid = isValidPlacement(g, row, col, num);
            steps.push({ id: stepId++, description: `Trying ${num} at (${row},${col}) - ${valid ? 'Valid' : 'Invalid'}`, data: { board: g.map(r => [...r]), currentCell: { row, col }, tryingValue: num, isValid: valid, isBacktracking: false }, isValid: valid });
            if (valid) {
              g[row][col] = num;
              if (solve(g)) return true;
              g[row][col] = 0;
              steps.push({ id: stepId++, description: `Backtracking from (${row},${col})`, data: { board: g.map(r => [...r]), currentCell: { row, col }, tryingValue: 0, isValid: true, isBacktracking: true }, isValid: true });
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(grid);
  steps.push({ id: stepId++, description: 'Sudoku solved!', data: { board: grid, currentCell: null, tryingValue: 0, isValid: true, isBacktracking: false }, isValid: true });
  return steps.slice(0, 100); // Limit for performance
}

export default function Sudoku() {
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const steps = generateSudokuSteps(initialBoard);
    setSteps(steps);
    setResult({ success: true, message: 'Sudoku solved successfully!', timeComplexity: 'O(9^n²)', spaceComplexity: 'O(n²)', iterations: steps.length - 2 });
  }, [setSteps, setResult]);

  const sudokuState = currentStepData?.data as SudokuState | undefined;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel title="Sudoku Solver" description="Backtracking visualization">
            <InputButton onClick={handleStart}>Solve Sudoku</InputButton>
          </InputPanel>
          <AlgorithmInfo config={config} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Sudoku" className="min-h-[450px]">
            {sudokuState ? (
              <div className="grid grid-cols-9 gap-0.5 bg-border p-1 rounded-lg">
                {sudokuState.board.map((row, i) => row.map((cell, j) => {
                  const isCurrent = sudokuState.currentCell?.row === i && sudokuState.currentCell?.col === j;
                  const isOriginal = initialBoard[i][j] !== 0;
                  return (
                    <motion.div key={`${i}-${j}`} className={cn(
                      "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm rounded",
                      (j + 1) % 3 === 0 && j < 8 && "mr-1",
                      (i + 1) % 3 === 0 && i < 8 && "mb-1",
                      isCurrent && !sudokuState.isValid && "bg-destructive/30 text-destructive",
                      isCurrent && sudokuState.isBacktracking && "bg-neon-orange/30",
                      isCurrent && sudokuState.isValid && !sudokuState.isBacktracking && "bg-neon-green/30 text-neon-green",
                      !isCurrent && isOriginal && "bg-muted/50 text-foreground",
                      !isCurrent && !isOriginal && "bg-card text-primary"
                    )}>{cell || ''}</motion.div>
                  );
                }))}
              </div>
            ) : <p className="text-muted-foreground">Click Solve to start</p>}
          </VisualizationCanvas>
          <ControlPanel isPlaying={state.isPlaying} isPaused={state.isPaused} currentStep={state.currentStep} totalSteps={state.totalSteps} speed={state.speed} onPlay={play} onPause={pause} onNextStep={nextStep} onPrevStep={prevStep} onReset={reset} onSpeedChange={setSpeed} disabled={state.totalSteps === 0} />
        </div>
        <div className="lg:col-span-1"><ResultPanel result={state.result} currentState={currentStepData?.description} /></div>
      </div>
    </Layout>
  );
}
