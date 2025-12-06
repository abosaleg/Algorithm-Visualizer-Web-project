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

const config: AlgorithmConfig = {
  id: 'fractional-knapsack',
  name: 'Fractional Knapsack',
  category: 'greedy',
  description: 'The fractional knapsack problem allows taking fractions of items. The greedy approach sorts items by value/weight ratio and takes the highest ratio items first.',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  pseudocode: [
    'function fractionalKnapsack(items, capacity):',
    '  sort items by value/weight ratio descending',
    '  totalValue = 0',
    '  for each item in items:',
    '    if capacity >= item.weight:',
    '      take whole item',
    '      capacity -= item.weight',
    '    else:',
    '      take fraction = capacity / item.weight',
    '      break',
    '  return totalValue',
  ],
  useCases: [
    'Resource allocation problems',
    'Investment portfolio optimization',
    'Loading cargo efficiently',
    'Bandwidth allocation',
  ],
};

interface Item {
  id: number;
  weight: number;
  value: number;
  ratio: number;
}

interface KnapsackState {
  items: Item[];
  sortedItems: Item[];
  currentItem: number;
  takenItems: { item: Item; fraction: number }[];
  currentCapacity: number;
  totalValue: number;
  phase: 'sorting' | 'selecting' | 'done';
}

function generateItems(): Item[] {
  const weights = [10, 20, 30, 15, 25];
  const values = [60, 100, 120, 75, 90];
  
  return weights.map((w, i) => ({
    id: i,
    weight: w,
    value: values[i],
    ratio: values[i] / w,
  }));
}

function generateKnapsackSteps(items: Item[], capacity: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;

  const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
  
  steps.push({
    id: stepId++,
    description: 'Initial items before sorting',
    data: {
      items,
      sortedItems: items,
      currentItem: -1,
      takenItems: [],
      currentCapacity: capacity,
      totalValue: 0,
      phase: 'sorting',
    } as KnapsackState,
    isValid: true,
  });

  steps.push({
    id: stepId++,
    description: 'Items sorted by value/weight ratio (descending)',
    data: {
      items,
      sortedItems,
      currentItem: -1,
      takenItems: [],
      currentCapacity: capacity,
      totalValue: 0,
      phase: 'selecting',
    } as KnapsackState,
    isValid: true,
  });

  let currentCapacity = capacity;
  let totalValue = 0;
  const takenItems: { item: Item; fraction: number }[] = [];

  for (let i = 0; i < sortedItems.length && currentCapacity > 0; i++) {
    const item = sortedItems[i];
    
    if (item.weight <= currentCapacity) {
      currentCapacity -= item.weight;
      totalValue += item.value;
      takenItems.push({ item, fraction: 1 });

      steps.push({
        id: stepId++,
        description: `Taking whole item ${item.id} (weight: ${item.weight}, value: ${item.value})`,
        data: {
          items,
          sortedItems,
          currentItem: i,
          takenItems: [...takenItems],
          currentCapacity,
          totalValue,
          phase: 'selecting',
        } as KnapsackState,
        isValid: true,
      });
    } else if (currentCapacity > 0) {
      const fraction = currentCapacity / item.weight;
      totalValue += item.value * fraction;
      takenItems.push({ item, fraction });
      
      steps.push({
        id: stepId++,
        description: `Taking ${(fraction * 100).toFixed(1)}% of item ${item.id} (weight: ${(item.weight * fraction).toFixed(1)}, value: ${(item.value * fraction).toFixed(1)})`,
        data: {
          items,
          sortedItems,
          currentItem: i,
          takenItems: [...takenItems],
          currentCapacity: 0,
          totalValue,
          phase: 'selecting',
        } as KnapsackState,
        isValid: true,
      });
      currentCapacity = 0;
    }
  }

  steps.push({
    id: stepId++,
    description: `Knapsack filled! Total value: ${totalValue.toFixed(2)}`,
    data: {
      items,
      sortedItems,
      currentItem: -1,
      takenItems,
      currentCapacity: 0,
      totalValue,
      phase: 'done',
    } as KnapsackState,
    isValid: true,
  });

  return steps;
}

export default function FractionalKnapsack() {
  const [capacity] = useState(50);
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const items = generateItems();
    const steps = generateKnapsackSteps(items, capacity);
    setSteps(steps);
    
    const finalState = steps[steps.length - 1].data as KnapsackState;
    setResult({
      success: true,
      message: `Maximum value achieved: ${finalState.totalValue.toFixed(2)}`,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      iterations: steps.length - 2,
      finalValue: finalState.totalValue.toFixed(2),
    });
  }, [capacity, setSteps, setResult]);

  const knapsackState = currentStepData?.data as KnapsackState | undefined;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel
            title="Configuration"
            description="Knapsack capacity: 50 units"
          >
            <InputButton onClick={handleStart}>
              Start Algorithm
            </InputButton>
          </InputPanel>

          <AlgorithmInfo config={config} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Fractional Knapsack" className="min-h-[450px]">
            {knapsackState ? (
              <KnapsackVisualization state={knapsackState} capacity={capacity} />
            ) : (
              <div className="text-muted-foreground text-center">
                <p className="mb-2">Click Start to begin the visualization</p>
                <p className="text-sm opacity-60">Greedy algorithm for optimal selection</p>
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

function KnapsackVisualization({ state, capacity }: { state: KnapsackState; capacity: number }) {
  return (
    <div className="w-full space-y-6 p-4">
      {/* Items table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left text-muted-foreground">Item</th>
              <th className="px-3 py-2 text-right text-muted-foreground">Weight</th>
              <th className="px-3 py-2 text-right text-muted-foreground">Value</th>
              <th className="px-3 py-2 text-right text-muted-foreground">Ratio</th>
              <th className="px-3 py-2 text-right text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.sortedItems.map((item, idx) => {
              const taken = state.takenItems.find(t => t.item.id === item.id);
              const isCurrent = idx === state.currentItem;
              
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-border/50 ${isCurrent ? 'bg-primary/10' : ''}`}
                >
                  <td className="px-3 py-2 font-medium">Item {item.id}</td>
                  <td className="px-3 py-2 text-right font-mono">{item.weight}</td>
                  <td className="px-3 py-2 text-right font-mono">{item.value}</td>
                  <td className="px-3 py-2 text-right font-mono text-primary">{item.ratio.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">
                    {taken ? (
                      <span className="text-neon-green text-xs">
                        {taken.fraction === 1 ? '100%' : `${(taken.fraction * 100).toFixed(1)}%`}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Knapsack visualization */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Knapsack:</span>
        <div className="flex-1 h-10 bg-muted/30 rounded-lg border border-border overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${((capacity - state.currentCapacity) / capacity) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
            {capacity - state.currentCapacity} / {capacity} units
          </div>
        </div>
      </div>

      {/* Taken items */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {state.takenItems.map(({ item, fraction }) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="px-3 py-2 rounded-lg bg-neon-green/20 border border-neon-green/30"
            >
              <span className="text-sm font-medium text-neon-green">
                Item {item.id} ({fraction === 1 ? '100%' : `${(fraction * 100).toFixed(1)}%`})
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total value */}
      <div className="text-center">
        <span className="text-muted-foreground">Total Value: </span>
        <span className="font-display text-2xl font-bold text-gradient">
          {state.totalValue.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
