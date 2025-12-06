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
  id: 'knights-tour',
  name: "Knight's Tour",
  category: 'backtracking',
  description: "Find a sequence of moves for a knight to visit every square on the chessboard exactly once.",
  timeComplexity: 'O(8^(n²))',
  spaceComplexity: 'O(n²)',
  pseudocode: ['function knightTour(board, x, y, move):', '  if move == n*n: return true', '  for each valid knight move (nx, ny):', '    if isValid(nx, ny):', '      board[nx][ny] = move', '      if knightTour(board, nx, ny, move+1): return true', '      board[nx][ny] = -1', '  return false'],
  useCases: ['Chess puzzles', 'Graph traversal', 'Hamiltonian path problems'],
};

const N = 5;
const moves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

function generateKnightSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;
  const board = Array(N).fill(null).map(() => Array(N).fill(-1));
  board[0][0] = 0;

  steps.push({ id: stepId++, description: 'Starting knight tour from (0,0)', data: { board: board.map(r => [...r]), current: {x: 0, y: 0}, move: 0, isBacktracking: false }, isValid: true });

  function solve(x: number, y: number, move: number): boolean {
    if (move === N * N) return true;
    for (const [dx, dy] of moves) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < N && ny < N && board[nx][ny] === -1) {
        board[nx][ny] = move;
        steps.push({ id: stepId++, description: `Move ${move}: Knight to (${nx},${ny})`, data: { board: board.map(r => [...r]), current: {x: nx, y: ny}, move, isBacktracking: false }, isValid: true });
        if (steps.length > 80) return true; // Limit for demo
        if (solve(nx, ny, move + 1)) return true;
        board[nx][ny] = -1;
        steps.push({ id: stepId++, description: `Backtracking from (${nx},${ny})`, data: { board: board.map(r => [...r]), current: {x, y}, move: move - 1, isBacktracking: true }, isValid: true });
      }
    }
    return false;
  }

  solve(0, 0, 1);
  return steps;
}

export default function KnightsTour() {
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const steps = generateKnightSteps();
    setSteps(steps);
    setResult({ success: true, message: 'Knight tour visualization', timeComplexity: 'O(8^n²)', spaceComplexity: 'O(n²)', iterations: steps.length - 1 });
  }, [setSteps, setResult]);

  const knightState = currentStepData?.data as any;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel title="Knight's Tour" description={`${N}x${N} board`}>
            <InputButton onClick={handleStart}>Start Tour</InputButton>
          </InputPanel>
          <AlgorithmInfo config={config} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Knight's Tour" className="min-h-[400px]">
            {knightState ? (
              <div className="grid grid-cols-5 gap-1">
                {knightState.board.map((row: number[], i: number) => row.map((cell: number, j: number) => {
                  const isCurrent = knightState.current?.x === i && knightState.current?.y === j;
                  const isDark = (i + j) % 2 === 1;
                  return (
                    <motion.div key={`${i}-${j}`} className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded flex items-center justify-center font-bold text-sm",
                      isDark ? "bg-muted/60" : "bg-card",
                      cell >= 0 && "border-2 border-primary/50",
                      isCurrent && !knightState.isBacktracking && "bg-primary/50 border-primary",
                      isCurrent && knightState.isBacktracking && "bg-neon-orange/50 border-neon-orange"
                    )}>{isCurrent ? '♞' : cell >= 0 ? cell : ''}</motion.div>
                  );
                }))}
              </div>
            ) : <p className="text-muted-foreground">Click Start Tour to begin</p>}
          </VisualizationCanvas>
          <ControlPanel isPlaying={state.isPlaying} isPaused={state.isPaused} currentStep={state.currentStep} totalSteps={state.totalSteps} speed={state.speed} onPlay={play} onPause={pause} onNextStep={nextStep} onPrevStep={prevStep} onReset={reset} onSpeedChange={setSpeed} disabled={state.totalSteps === 0} />
        </div>
        <div className="lg:col-span-1"><ResultPanel result={state.result} currentState={currentStepData?.description} /></div>
      </div>
    </Layout>
  );
}
