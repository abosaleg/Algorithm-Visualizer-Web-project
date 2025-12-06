import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { VisualizationCanvas } from '@/components/visualization/VisualizationCanvas';
import { ControlPanel } from '@/components/visualization/ControlPanel';
import { ResultPanel } from '@/components/visualization/ResultPanel';
import { InputPanel, InputField, InputButton } from '@/components/visualization/InputPanel';
import { AlgorithmInfo } from '@/components/visualization/AlgorithmInfo';
import { useVisualization } from '@/hooks/useVisualization';
import { AlgorithmConfig, AlgorithmStep, AlgorithmResult } from '@/types/algorithm';

const config: AlgorithmConfig = {
  id: 'tower-of-hanoi',
  name: 'Tower of Hanoi',
  category: 'divide-conquer',
  description: 'The Tower of Hanoi is a classic puzzle that demonstrates the power of recursion and divide-and-conquer. The goal is to move all disks from the source peg to the destination peg, following specific rules.',
  timeComplexity: 'O(2ⁿ)',
  spaceComplexity: 'O(n)',
  pseudocode: [
    'function hanoi(n, source, target, auxiliary):',
    '  if n == 1:',
    '    move disk from source to target',
    '    return',
    '  hanoi(n-1, source, auxiliary, target)',
    '  move disk from source to target',
    '  hanoi(n-1, auxiliary, target, source)',
  ],
  useCases: [
    'Understanding recursion fundamentals',
    'Teaching divide-and-conquer strategy',
    'Backup rotation schemes',
    'Puzzle games and brain teasers',
  ],
};

interface Disk {
  id: number;
  size: number;
}

interface HanoiState {
  pegs: Disk[][];
  moveFrom: number;
  moveTo: number;
  movingDisk: Disk | null;
  recursionDepth: number;
}

function generateHanoiSteps(n: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const pegs: Disk[][] = [
    Array.from({ length: n }, (_, i) => ({ id: i, size: n - i })),
    [],
    [],
  ];

  steps.push({
    id: 0,
    description: `Starting with ${n} disks on peg A`,
    data: { pegs: JSON.parse(JSON.stringify(pegs)), moveFrom: -1, moveTo: -1, movingDisk: null, recursionDepth: 0 } as HanoiState,
    isValid: true,
  });

  let stepId = 1;
  
  function solve(n: number, from: number, to: number, aux: number, depth: number) {
    if (n === 0) return;
    
    solve(n - 1, from, aux, to, depth + 1);
    
    const disk = pegs[from].pop()!;
    const isValid = pegs[to].length === 0 || pegs[to][pegs[to].length - 1].size > disk.size;
    pegs[to].push(disk);
    
    steps.push({
      id: stepId++,
      description: `Move disk ${disk.size} from peg ${['A', 'B', 'C'][from]} to peg ${['A', 'B', 'C'][to]}`,
      data: {
        pegs: JSON.parse(JSON.stringify(pegs)),
        moveFrom: from,
        moveTo: to,
        movingDisk: disk,
        recursionDepth: depth,
      } as HanoiState,
      isValid,
    });
    
    solve(n - 1, aux, to, from, depth + 1);
  }
  
  solve(n, 0, 2, 1, 1);
  
  return steps;
}

export default function TowerOfHanoi() {
  const [diskCount, setDiskCount] = useState('3');
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const n = Math.min(Math.max(parseInt(diskCount) || 3, 1), 8);
    const steps = generateHanoiSteps(n);
    setSteps(steps);
    
    setResult({
      success: true,
      message: `Solved Tower of Hanoi with ${n} disks`,
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n)',
      iterations: steps.length - 1,
      finalValue: `${Math.pow(2, n) - 1} moves`,
    });
  }, [diskCount, setSteps, setResult]);

  const hanoiState = currentStepData?.data as HanoiState | undefined;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Input */}
        <div className="lg:col-span-1 space-y-4">
          <InputPanel
            title="Configuration"
            description="Set up the Tower of Hanoi puzzle"
          >
            <InputField
              label="Number of Disks (1-8)"
              type="number"
              value={diskCount}
              onChange={setDiskCount}
              min={1}
              max={8}
            />
            <InputButton onClick={handleStart}>
              Generate Puzzle
            </InputButton>
          </InputPanel>

          <AlgorithmInfo config={config} />
        </div>

        {/* Center - Visualization */}
        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Tower of Hanoi" className="min-h-[450px]">
            {hanoiState ? (
              <HanoiVisualization state={hanoiState} />
            ) : (
              <div className="text-muted-foreground text-center">
                <p className="mb-2">Configure and generate the puzzle to start</p>
                <p className="text-sm opacity-60">The classic disk-moving puzzle</p>
              </div>
            )}
          </VisualizationCanvas>

          <ControlPanel
            isPlaying={state.isPlaying}
            isPaused={state.isPaused}
            currentStep={state.currentStep}
            totalSteps={state.totalSteps}
            speed={state.speed}
            onPlay={play}
            onPause={pause}
            onNextStep={nextStep}
            onPrevStep={prevStep}
            onReset={reset}
            onSpeedChange={setSpeed}
            disabled={state.totalSteps === 0}
          />
        </div>

        {/* Right Panel - Results */}
        <div className="lg:col-span-1">
          <ResultPanel
            result={state.result}
            currentState={currentStepData?.description}
          />
          
          {/* Recursion Depth Indicator */}
          {hanoiState && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 mt-4"
            >
              <h4 className="text-sm font-semibold mb-2">Recursion Depth</h4>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.max(hanoiState.recursionDepth, 1) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Current depth: {hanoiState.recursionDepth}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function HanoiVisualization({ state }: { state: HanoiState }) {
  const maxDisks = Math.max(...state.pegs.flatMap(p => p.map(d => d.size)), 3);
  const pegWidth = 8;
  const diskHeight = 24;
  const baseWidth = 140;
  const pegHeight = maxDisks * diskHeight + 40;

  return (
    <div className="flex justify-center items-end gap-8 w-full">
      {state.pegs.map((peg, pegIndex) => (
        <div key={pegIndex} className="flex flex-col items-center">
          {/* Peg label */}
          <span className="text-sm font-semibold mb-2 text-muted-foreground">
            Peg {['A', 'B', 'C'][pegIndex]}
          </span>
          
          {/* Peg container */}
          <div className="relative" style={{ width: baseWidth, height: pegHeight }}>
            {/* Peg pole */}
            <div
              className="absolute left-1/2 bottom-0 -translate-x-1/2 bg-muted rounded-t-sm"
              style={{ width: pegWidth, height: pegHeight - 10 }}
            />
            
            {/* Base */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-muted/80 rounded-lg"
              style={{ width: baseWidth, height: 10 }}
            />
            
            {/* Disks */}
            <AnimatePresence>
              {peg.map((disk, diskIndex) => {
                const diskWidth = 40 + (disk.size / maxDisks) * 80;
                const isMoving = state.movingDisk?.id === disk.id;
                const hue = (disk.size / maxDisks) * 60 + 180; // Cyan to purple
                
                return (
                  <motion.div
                    key={disk.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="absolute left-1/2 -translate-x-1/2 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      width: diskWidth,
                      height: diskHeight - 4,
                      bottom: 12 + diskIndex * diskHeight,
                      background: `linear-gradient(135deg, hsl(${hue}, 100%, 50%), hsl(${hue + 40}, 100%, 40%))`,
                      boxShadow: isMoving 
                        ? `0 0 20px hsl(${hue}, 100%, 50%), 0 4px 12px rgba(0,0,0,0.3)` 
                        : '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <span className="text-white drop-shadow">{disk.size}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
