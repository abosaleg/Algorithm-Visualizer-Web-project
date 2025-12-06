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

const config: AlgorithmConfig = {
  id: 'bellman-ford',
  name: 'Bellman-Ford',
  category: 'dynamic-programming',
  description: 'Find shortest paths from source to all vertices, even with negative edge weights. Detects negative cycles.',
  timeComplexity: 'O(V × E)',
  spaceComplexity: 'O(V)',
  pseudocode: ['function bellmanFord(graph, source):', '  dist[source] = 0, others = ∞', '  for i from 1 to V-1:', '    for each edge (u, v, w):', '      if dist[u] + w < dist[v]:', '        dist[v] = dist[u] + w', '  check for negative cycles', '  return dist'],
  useCases: ['Routing protocols (RIP)', 'Arbitrage detection', 'Network flow', 'GPS navigation'],
};

const edges = [[0,1,4],[0,2,5],[1,2,-3],[1,3,6],[2,3,1]];
const V = 4;

function generateBellmanSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;
  const dist = [0, Infinity, Infinity, Infinity];

  steps.push({ id: stepId++, description: 'Initialize distances', data: { dist: [...dist], currentEdge: null, relaxed: false }, isValid: true });

  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, w] of edges) {
      const oldDist = dist[v];
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        steps.push({ id: stepId++, description: `Relaxing edge (${u}→${v}): dist[${v}] = ${dist[v]}`, data: { dist: [...dist], currentEdge: [u, v], relaxed: true }, isValid: true });
      }
    }
  }

  steps.push({ id: stepId++, description: 'Bellman-Ford complete!', data: { dist: [...dist], currentEdge: null, relaxed: false }, isValid: true });
  return steps;
}

export default function BellmanFord() {
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const steps = generateBellmanSteps();
    setSteps(steps);
    const finalDist = (steps[steps.length - 1].data as any).dist;
    setResult({ success: true, message: `Shortest distances: [${finalDist.join(', ')}]`, timeComplexity: 'O(V×E)', spaceComplexity: 'O(V)', iterations: steps.length - 2 });
  }, [setSteps, setResult]);

  const bfState = currentStepData?.data as any;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel title="Bellman-Ford" description="Shortest path with negative edges">
            <InputButton onClick={handleStart}>Find Paths</InputButton>
          </InputPanel>
          <AlgorithmInfo config={config} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Graph" className="min-h-[400px]">
            {bfState ? (
              <div className="space-y-6">
                <svg viewBox="0 0 300 200" className="w-full max-w-md mx-auto">
                  {edges.map(([u, v, w], i) => {
                    const pos = [[50,100],[150,50],[150,150],[250,100]];
                    const isCurrent = bfState.currentEdge?.[0] === u && bfState.currentEdge?.[1] === v;
                    return (
                      <g key={i}>
                        <line x1={pos[u][0]} y1={pos[u][1]} x2={pos[v][0]} y2={pos[v][1]} stroke={isCurrent ? 'hsl(var(--neon-green))' : 'hsl(var(--border))'} strokeWidth={isCurrent ? 3 : 2} />
                        <text x={(pos[u][0]+pos[v][0])/2} y={(pos[u][1]+pos[v][1])/2 - 5} fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="middle">{w}</text>
                      </g>
                    );
                  })}
                  {[[50,100],[150,50],[150,150],[250,100]].map((p, i) => (
                    <g key={i}>
                      <circle cx={p[0]} cy={p[1]} r="20" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
                      <text x={p[0]} y={p[1]+5} fill="hsl(var(--foreground))" fontSize="14" textAnchor="middle" fontWeight="bold">{i}</text>
                      <text x={p[0]} y={p[1]+35} fill="hsl(var(--primary))" fontSize="11" textAnchor="middle">{bfState.dist[i] === Infinity ? '∞' : bfState.dist[i]}</text>
                    </g>
                  ))}
                </svg>
                <div className="flex justify-center gap-4">
                  {bfState.dist.map((d: number, i: number) => (
                    <motion.div key={i} className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-center">
                      <div className="text-xs text-muted-foreground">Node {i}</div>
                      <div className="font-mono font-bold text-primary">{d === Infinity ? '∞' : d}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : <p className="text-muted-foreground">Click Find Paths to start</p>}
          </VisualizationCanvas>
          <ControlPanel isPlaying={state.isPlaying} isPaused={state.isPaused} currentStep={state.currentStep} totalSteps={state.totalSteps} speed={state.speed} onPlay={play} onPause={pause} onNextStep={nextStep} onPrevStep={prevStep} onReset={reset} onSpeedChange={setSpeed} disabled={state.totalSteps === 0} />
        </div>
        <div className="lg:col-span-1"><ResultPanel result={state.result} currentState={currentStepData?.description} /></div>
      </div>
    </Layout>
  );
}
