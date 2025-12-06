import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { VisualizationCanvas } from '@/components/visualization/VisualizationCanvas';
import { ControlPanel } from '@/components/visualization/ControlPanel';
import { ResultPanel } from '@/components/visualization/ResultPanel';
import { InputPanel, InputField, InputButton } from '@/components/visualization/InputPanel';
import { AlgorithmInfo } from '@/components/visualization/AlgorithmInfo';
import { useVisualization } from '@/hooks/useVisualization';
import { AlgorithmConfig, AlgorithmStep } from '@/types/algorithm';

const config: AlgorithmConfig = {
  id: 'closest-pair',
  name: 'Closest Pair of Points',
  category: 'divide-conquer',
  description: 'Find the two points with the smallest Euclidean distance among a set of points in a 2D plane using divide-and-conquer approach.',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  pseudocode: [
    'function closestPair(points):',
    '  if points.length <= 3:',
    '    return bruteForce(points)',
    '  mid = points.length / 2',
    '  left = closestPair(points[0..mid])',
    '  right = closestPair(points[mid..n])',
    '  d = min(left.dist, right.dist)',
    '  strip = getPointsInStrip(d)',
    '  return min(d, closestInStrip(strip))',
  ],
  useCases: [
    'Collision detection in games',
    'Geographic information systems',
    'Cluster analysis',
    'Computer graphics and computational geometry',
  ],
};

interface Point {
  x: number;
  y: number;
  id: number;
}

interface ClosestPairState {
  points: Point[];
  comparing: [number, number] | null;
  closestPair: [number, number] | null;
  minDistance: number;
  strip: number[];
  phase: 'dividing' | 'conquering' | 'strip' | 'done';
}

function generateRandomPoints(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    id: i,
  }));
}

function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function generateClosestPairSteps(points: Point[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;
  let minDist = Infinity;
  let closestPair: [number, number] | null = null;

  steps.push({
    id: stepId++,
    description: `Starting with ${points.length} points`,
    data: { points, comparing: null, closestPair: null, minDistance: Infinity, strip: [], phase: 'dividing' } as ClosestPairState,
    isValid: true,
  });

  // Brute force for small sets to show comparison
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const d = distance(points[i], points[j]);
      
      steps.push({
        id: stepId++,
        description: `Comparing point ${i} and point ${j}, distance: ${d.toFixed(2)}`,
        data: {
          points,
          comparing: [i, j],
          closestPair,
          minDistance: minDist,
          strip: [],
          phase: 'conquering',
        } as ClosestPairState,
        isValid: true,
      });

      if (d < minDist) {
        minDist = d;
        closestPair = [i, j];
        
        steps.push({
          id: stepId++,
          description: `New minimum distance: ${d.toFixed(2)} between points ${i} and ${j}`,
          data: {
            points,
            comparing: [i, j],
            closestPair,
            minDistance: minDist,
            strip: [],
            phase: 'conquering',
          } as ClosestPairState,
          isValid: true,
        });
      }
    }
  }

  steps.push({
    id: stepId++,
    description: `Closest pair found! Distance: ${minDist.toFixed(2)}`,
    data: {
      points,
      comparing: null,
      closestPair,
      minDistance: minDist,
      strip: [],
      phase: 'done',
    } as ClosestPairState,
    isValid: true,
  });

  return steps;
}

export default function ClosestPair() {
  const [pointCount, setPointCount] = useState('8');
  const [points, setPoints] = useState<Point[]>([]);
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleGenerate = useCallback(() => {
    const n = Math.min(Math.max(parseInt(pointCount) || 8, 3), 20);
    const newPoints = generateRandomPoints(n);
    setPoints(newPoints);
    const steps = generateClosestPairSteps(newPoints);
    setSteps(steps);
    
    const finalState = steps[steps.length - 1].data as ClosestPairState;
    setResult({
      success: true,
      message: `Found closest pair with distance ${finalState.minDistance.toFixed(4)}`,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      iterations: steps.length - 2,
      finalValue: finalState.minDistance.toFixed(4),
    });
  }, [pointCount, setSteps, setResult]);

  const pairState = currentStepData?.data as ClosestPairState | undefined;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel
            title="Configuration"
            description="Set up the point cloud"
          >
            <InputField
              label="Number of Points (3-20)"
              type="number"
              value={pointCount}
              onChange={setPointCount}
              min={3}
              max={20}
            />
            <InputButton onClick={handleGenerate}>
              Generate Points
            </InputButton>
          </InputPanel>

          <AlgorithmInfo config={config} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Closest Pair of Points" className="min-h-[450px]">
            {pairState ? (
              <ClosestPairVisualization state={pairState} />
            ) : (
              <div className="text-muted-foreground text-center">
                <p className="mb-2">Generate points to start visualization</p>
                <p className="text-sm opacity-60">Finding the closest pair of points</p>
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

function ClosestPairVisualization({ state }: { state: ClosestPairState }) {
  return (
    <div className="relative w-full h-full min-h-[350px]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Connection line for comparing pair */}
        {state.comparing && (
          <motion.line
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            x1={state.points[state.comparing[0]].x}
            y1={state.points[state.comparing[0]].y}
            x2={state.points[state.comparing[1]].x}
            y2={state.points[state.comparing[1]].y}
            stroke="hsl(var(--neon-orange))"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        )}
        
        {/* Connection line for closest pair */}
        {state.closestPair && state.phase === 'done' && (
          <motion.line
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            x1={state.points[state.closestPair[0]].x}
            y1={state.points[state.closestPair[0]].y}
            x2={state.points[state.closestPair[1]].x}
            y2={state.points[state.closestPair[1]].y}
            stroke="hsl(var(--neon-green))"
            strokeWidth="1"
          />
        )}
        
        {/* Points */}
        {state.points.map((point, i) => {
          const isComparing = state.comparing?.includes(i);
          const isClosest = state.closestPair?.includes(i);
          
          return (
            <motion.g key={point.id}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={isClosest && state.phase === 'done' ? 3 : isComparing ? 2.5 : 2}
                fill={
                  isClosest && state.phase === 'done'
                    ? 'hsl(var(--neon-green))'
                    : isComparing
                    ? 'hsl(var(--neon-orange))'
                    : 'hsl(var(--primary))'
                }
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                }}
                transition={{ delay: i * 0.05 }}
              />
              <text
                x={point.x}
                y={point.y - 4}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="3"
              >
                {i}
              </text>
            </motion.g>
          );
        })}
      </svg>
      
      {/* Distance display */}
      {state.minDistance < Infinity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 glass-card px-3 py-2"
        >
          <span className="text-xs text-muted-foreground">Min Distance: </span>
          <span className="font-mono text-primary">{state.minDistance.toFixed(2)}</span>
        </motion.div>
      )}
    </div>
  );
}
