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
  id: 'optimal-merge',
  name: 'Optimal Merge Pattern',
  category: 'greedy',
  description: 'Find the optimal way to merge n sorted files into a single file by always merging the two smallest files first (greedy approach using min-heap).',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  pseudocode: [
    'function optimalMerge(files):',
    '  heap = MinHeap(files)',
    '  totalCost = 0',
    '  while heap.size > 1:',
    '    first = heap.extractMin()',
    '    second = heap.extractMin()',
    '    merged = first + second',
    '    totalCost += merged',
    '    heap.insert(merged)',
    '  return totalCost',
  ],
  useCases: [
    'File merging in external sorting',
    'Huffman coding for compression',
    'Database query optimization',
    'Merge sort optimization',
  ],
};

interface HeapNode {
  id: number;
  value: number;
  isNew?: boolean;
  isSelected?: boolean;
}

interface MergeState {
  heap: HeapNode[];
  selected: [HeapNode, HeapNode] | null;
  merged: HeapNode | null;
  totalCost: number;
  phase: 'selecting' | 'merging' | 'inserting' | 'done';
  history: { files: number[]; cost: number }[];
}

function generateMergeSteps(fileSizes: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;
  let nodeId = fileSizes.length;

  let heap: HeapNode[] = fileSizes.map((v, i) => ({ id: i, value: v }));
  heap.sort((a, b) => a.value - b.value);

  const history: { files: number[]; cost: number }[] = [];
  let totalCost = 0;

  steps.push({
    id: stepId++,
    description: `Starting with ${heap.length} files: [${heap.map(h => h.value).join(', ')}]`,
    data: {
      heap: [...heap],
      selected: null,
      merged: null,
      totalCost: 0,
      phase: 'selecting',
      history: [],
    } as MergeState,
    isValid: true,
  });

  while (heap.length > 1) {
    // Select two smallest
    const first = heap.shift()!;
    const second = heap.shift()!;
    
    steps.push({
      id: stepId++,
      description: `Selecting smallest files: ${first.value} and ${second.value}`,
      data: {
        heap: [...heap],
        selected: [{ ...first, isSelected: true }, { ...second, isSelected: true }],
        merged: null,
        totalCost,
        phase: 'selecting',
        history: [...history],
      } as MergeState,
      isValid: true,
    });

    // Merge
    const mergedValue = first.value + second.value;
    totalCost += mergedValue;
    const mergedNode: HeapNode = { id: nodeId++, value: mergedValue, isNew: true };

    steps.push({
      id: stepId++,
      description: `Merging: ${first.value} + ${second.value} = ${mergedValue} (cost: ${mergedValue})`,
      data: {
        heap: [...heap],
        selected: [first, second],
        merged: mergedNode,
        totalCost,
        phase: 'merging',
        history: [...history],
      } as MergeState,
      isValid: true,
    });

    history.push({ files: [first.value, second.value], cost: mergedValue });

    // Insert back into heap
    heap.push({ ...mergedNode, isNew: false });
    heap.sort((a, b) => a.value - b.value);

    steps.push({
      id: stepId++,
      description: `Inserted merged file (${mergedValue}) back into heap`,
      data: {
        heap: [...heap],
        selected: null,
        merged: null,
        totalCost,
        phase: 'inserting',
        history: [...history],
      } as MergeState,
      isValid: true,
    });
  }

  steps.push({
    id: stepId++,
    description: `All files merged! Total cost: ${totalCost}`,
    data: {
      heap,
      selected: null,
      merged: null,
      totalCost,
      phase: 'done',
      history,
    } as MergeState,
    isValid: true,
  });

  return steps;
}

export default function OptimalMerge() {
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const fileSizes = [5, 10, 20, 30, 40];
    const steps = generateMergeSteps(fileSizes);
    setSteps(steps);
    
    const finalState = steps[steps.length - 1].data as MergeState;
    setResult({
      success: true,
      message: `Optimal merge completed with total cost: ${finalState.totalCost}`,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      iterations: finalState.history.length,
      finalValue: finalState.totalCost,
    });
  }, [setSteps, setResult]);

  const mergeState = currentStepData?.data as MergeState | undefined;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel
            title="Configuration"
            description="Files: [5, 10, 20, 30, 40]"
          >
            <InputButton onClick={handleStart}>
              Start Algorithm
            </InputButton>
          </InputPanel>

          <AlgorithmInfo config={config} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Optimal Merge Pattern" className="min-h-[450px]">
            {mergeState ? (
              <MergeVisualization state={mergeState} />
            ) : (
              <div className="text-muted-foreground text-center">
                <p className="mb-2">Click Start to begin the visualization</p>
                <p className="text-sm opacity-60">Min-heap based file merging</p>
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

function MergeVisualization({ state }: { state: MergeState }) {
  return (
    <div className="w-full space-y-6 p-4">
      {/* Min-Heap visualization */}
      <div className="text-center mb-4">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Min-Heap</h4>
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence mode="popLayout">
            {state.heap.map((node, idx) => (
              <motion.div
                key={node.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold ${
                  node.isNew
                    ? 'bg-neon-green/20 border-2 border-neon-green'
                    : idx === 0
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-muted/30 border border-border'
                }`}
              >
                {node.value}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Selected files */}
      {state.selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-neon-orange/20 border-2 border-neon-orange flex items-center justify-center font-bold">
            {state.selected[0].value}
          </div>
          <span className="text-2xl font-bold text-muted-foreground">+</span>
          <div className="w-14 h-14 rounded-xl bg-neon-orange/20 border-2 border-neon-orange flex items-center justify-center font-bold">
            {state.selected[1].value}
          </div>
          {state.merged && (
            <>
              <span className="text-2xl font-bold text-muted-foreground">=</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 rounded-xl bg-neon-green/20 border-2 border-neon-green flex items-center justify-center font-bold text-neon-green"
              >
                {state.merged.value}
              </motion.div>
            </>
          )}
        </motion.div>
      )}

      {/* Merge history */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-muted-foreground">Merge History</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          <AnimatePresence>
            {state.history.map((h, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/20"
              >
                <span className="text-muted-foreground">#{idx + 1}:</span>
                <span>{h.files[0]} + {h.files[1]}</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-primary font-medium">{h.cost}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Total cost */}
      <div className="text-center pt-4 border-t border-border">
        <span className="text-muted-foreground">Total Cost: </span>
        <span className="font-display text-2xl font-bold text-gradient">
          {state.totalCost}
        </span>
      </div>
    </div>
  );
}
