import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  id: 'knapsack-01',
  name: '0/1 Knapsack',
  category: 'dynamic-programming',
  description: 'Solve the 0/1 knapsack problem using dynamic programming. Each item can either be taken completely or not at all (no fractions).',
  timeComplexity: 'O(n × W)',
  spaceComplexity: 'O(n × W)',
  pseudocode: [
    'function knapsack01(items, W):',
    '  dp[0..n][0..W] = 0',
    '  for i from 1 to n:',
    '    for w from 1 to W:',
    '      if items[i].weight <= w:',
    '        dp[i][w] = max(dp[i-1][w],',
    '          dp[i-1][w-items[i].weight] + items[i].value)',
    '      else:',
    '        dp[i][w] = dp[i-1][w]',
    '  return dp[n][W]',
  ],
  useCases: [
    'Resource allocation with discrete items',
    'Portfolio selection',
    'Cutting stock problems',
    'Cargo loading',
  ],
};

interface Item {
  weight: number;
  value: number;
}

interface KnapsackState {
  items: Item[];
  dp: number[][];
  currentI: number;
  currentW: number;
  selectedItems: number[];
  phase: 'building' | 'backtracking' | 'done';
}

function generateKnapsackSteps(items: Item[], capacity: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;
  const n = items.length;

  // Initialize DP table
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  steps.push({
    id: stepId++,
    description: 'Initialize DP table with zeros',
    data: {
      items,
      dp: JSON.parse(JSON.stringify(dp)),
      currentI: -1,
      currentW: -1,
      selectedItems: [],
      phase: 'building',
    } as KnapsackState,
    isValid: true,
  });

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (items[i - 1].weight <= w) {
        const withItem = dp[i - 1][w - items[i - 1].weight] + items[i - 1].value;
        const withoutItem = dp[i - 1][w];
        dp[i][w] = Math.max(withItem, withoutItem);
        
        if (dp[i][w] !== dp[i - 1][w]) {
          steps.push({
            id: stepId++,
            description: `dp[${i}][${w}] = max(${withoutItem}, ${withItem}) = ${dp[i][w]} (take item ${i})`,
            data: {
              items,
              dp: JSON.parse(JSON.stringify(dp)),
              currentI: i,
              currentW: w,
              selectedItems: [],
              phase: 'building',
            } as KnapsackState,
            isValid: true,
          });
        }
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected items
  const selectedItems: number[] = [];
  let w = capacity;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(i - 1);
      w -= items[i - 1].weight;
      
      steps.push({
        id: stepId++,
        description: `Backtracking: Item ${i} was selected`,
        data: {
          items,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentW: w,
          selectedItems: [...selectedItems],
          phase: 'backtracking',
        } as KnapsackState,
        isValid: true,
      });
    }
  }

  steps.push({
    id: stepId++,
    description: `Maximum value: ${dp[n][capacity]}`,
    data: {
      items,
      dp,
      currentI: -1,
      currentW: -1,
      selectedItems,
      phase: 'done',
    } as KnapsackState,
    isValid: true,
  });

  return steps;
}

export default function Knapsack01() {
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const items: Item[] = [
      { weight: 2, value: 3 },
      { weight: 3, value: 4 },
      { weight: 4, value: 5 },
      { weight: 5, value: 6 },
    ];
    const capacity = 8;
    
    const steps = generateKnapsackSteps(items, capacity);
    setSteps(steps);
    
    const finalState = steps[steps.length - 1].data as KnapsackState;
    const maxValue = finalState.dp[items.length][capacity];
    setResult({
      success: true,
      message: `Maximum value achievable: ${maxValue}`,
      timeComplexity: 'O(n × W)',
      spaceComplexity: 'O(n × W)',
      iterations: steps.length - 2,
      finalValue: maxValue,
    });
  }, [setSteps, setResult]);

  const knapsackState = currentStepData?.data as KnapsackState | undefined;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel
            title="Configuration"
            description="Items: (w:2,v:3), (w:3,v:4), (w:4,v:5), (w:5,v:6), Capacity: 8"
          >
            <InputButton onClick={handleStart}>
              Start Algorithm
            </InputButton>
          </InputPanel>

          <AlgorithmInfo config={config} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="0/1 Knapsack DP" className="min-h-[450px]">
            {knapsackState ? (
              <Knapsack01Visualization state={knapsackState} />
            ) : (
              <div className="text-muted-foreground text-center">
                <p className="mb-2">Click Start to begin the visualization</p>
                <p className="text-sm opacity-60">Dynamic programming approach</p>
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

        <div className="lg:col-span-1">
          <ResultPanel
            result={state.result}
            currentState={currentStepData?.description}
          />
        </div>
      </div>
    </Layout>
  );
}

function Knapsack01Visualization({ state }: { state: KnapsackState }) {
  return (
    <div className="w-full space-y-4 p-4 overflow-x-auto">
      {/* Items */}
      <div className="flex gap-4 mb-4">
        {state.items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "px-3 py-2 rounded-lg border text-sm",
              state.selectedItems.includes(idx)
                ? "bg-neon-green/20 border-neon-green text-neon-green"
                : "bg-muted/30 border-border"
            )}
          >
            Item {idx + 1}: w={item.weight}, v={item.value}
          </motion.div>
        ))}
      </div>

      {/* DP Table */}
      <div className="text-sm">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-border text-muted-foreground">i \ w</th>
              {state.dp[0]?.map((_, w) => (
                <th key={w} className="p-2 border border-border text-muted-foreground w-10">{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.dp.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-border text-muted-foreground font-medium">{i}</td>
                {row.map((cell, w) => {
                  const isCurrent = i === state.currentI && w === state.currentW;
                  const isPath = state.phase === 'backtracking' && 
                    state.selectedItems.some((idx) => {
                      // Check if this cell is part of backtrack path
                      return i === idx + 1;
                    });
                  
                  return (
                    <td
                      key={w}
                      className={cn(
                        "p-2 border border-border text-center w-10 transition-colors",
                        isCurrent && "bg-primary/30 text-primary font-bold",
                        isPath && state.phase === 'backtracking' && "bg-neon-green/20",
                        cell > 0 && !isCurrent && "bg-muted/20"
                      )}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected items summary */}
      {state.selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/30"
        >
          <span className="text-sm text-muted-foreground">Selected: </span>
          <span className="font-medium text-neon-green">
            Items {state.selectedItems.map(i => i + 1).join(', ')}
          </span>
        </motion.div>
      )}
    </div>
  );
}
