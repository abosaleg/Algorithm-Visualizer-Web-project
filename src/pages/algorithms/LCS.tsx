import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { VisualizationCanvas } from '@/components/visualization/VisualizationCanvas';
import { ControlPanel } from '@/components/visualization/ControlPanel';
import { ResultPanel } from '@/components/visualization/ResultPanel';
import { InputPanel, InputField, InputButton } from '@/components/visualization/InputPanel';
import { AlgorithmInfo } from '@/components/visualization/AlgorithmInfo';
import { useVisualization } from '@/hooks/useVisualization';
import { AlgorithmConfig, AlgorithmStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

const config: AlgorithmConfig = {
  id: 'lcs',
  name: 'Longest Common Subsequence',
  category: 'dynamic-programming',
  description: 'Find the longest subsequence common to two sequences using dynamic programming. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.',
  timeComplexity: 'O(m × n)',
  spaceComplexity: 'O(m × n)',
  pseudocode: [
    'function LCS(X, Y):',
    '  m, n = length(X), length(Y)',
    '  dp[0..m][0..n] = 0',
    '  for i from 1 to m:',
    '    for j from 1 to n:',
    '      if X[i] == Y[j]:',
    '        dp[i][j] = dp[i-1][j-1] + 1',
    '      else:',
    '        dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    '  return backtrack(dp)',
  ],
  useCases: [
    'Git diff algorithms',
    'DNA sequence alignment',
    'Spell checkers and autocorrect',
    'File comparison tools',
  ],
};

interface LCSState {
  str1: string;
  str2: string;
  dp: number[][];
  currentI: number;
  currentJ: number;
  lcs: string;
  matchedIndices: { i: number; j: number }[];
  phase: 'building' | 'backtracking' | 'done';
}

function generateLCSSteps(str1: string, str2: string): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;
  const m = str1.length;
  const n = str2.length;

  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  steps.push({
    id: stepId++,
    description: `Finding LCS of "${str1}" and "${str2}"`,
    data: {
      str1,
      str2,
      dp: JSON.parse(JSON.stringify(dp)),
      currentI: -1,
      currentJ: -1,
      lcs: '',
      matchedIndices: [],
      phase: 'building',
    } as LCSState,
    isValid: true,
  });

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          id: stepId++,
          description: `Match! '${str1[i - 1]}' = '${str2[j - 1]}', dp[${i}][${j}] = ${dp[i][j]}`,
          data: {
            str1,
            str2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            lcs: '',
            matchedIndices: [],
            phase: 'building',
          } as LCSState,
          isValid: true,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find LCS
  let lcs = '';
  let i = m, j = n;
  const matchedIndices: { i: number; j: number }[] = [];

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs = str1[i - 1] + lcs;
      matchedIndices.unshift({ i: i - 1, j: j - 1 });
      
      steps.push({
        id: stepId++,
        description: `Backtrack: Found '${str1[i - 1]}' in LCS`,
        data: {
          str1,
          str2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          lcs,
          matchedIndices: [...matchedIndices],
          phase: 'backtracking',
        } as LCSState,
        isValid: true,
      });
      
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  steps.push({
    id: stepId++,
    description: `LCS found: "${lcs}" (length: ${lcs.length})`,
    data: {
      str1,
      str2,
      dp,
      currentI: -1,
      currentJ: -1,
      lcs,
      matchedIndices,
      phase: 'done',
    } as LCSState,
    isValid: true,
  });

  return steps;
}

export default function LCS() {
  const [str1, setStr1] = useState('AGGTAB');
  const [str2, setStr2] = useState('GXTXAYB');
  const { state, setSteps, play, pause, nextStep, prevStep, reset, setSpeed, setResult, currentStepData } = useVisualization();

  const handleStart = useCallback(() => {
    const steps = generateLCSSteps(str1.toUpperCase(), str2.toUpperCase());
    setSteps(steps);
    
    const finalState = steps[steps.length - 1].data as LCSState;
    setResult({
      success: true,
      message: `LCS: "${finalState.lcs}" with length ${finalState.lcs.length}`,
      timeComplexity: 'O(m × n)',
      spaceComplexity: 'O(m × n)',
      iterations: steps.length - 2,
      finalValue: finalState.lcs,
    });
  }, [str1, str2, setSteps, setResult]);

  const lcsState = currentStepData?.data as LCSState | undefined;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <InputPanel
            title="Configuration"
            description="Enter two strings to compare"
          >
            <InputField
              label="String 1"
              value={str1}
              onChange={setStr1}
              placeholder="AGGTAB"
            />
            <InputField
              label="String 2"
              value={str2}
              onChange={setStr2}
              placeholder="GXTXAYB"
            />
            <InputButton onClick={handleStart}>
              Find LCS
            </InputButton>
          </InputPanel>

          <AlgorithmInfo config={config} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <VisualizationCanvas title="Longest Common Subsequence" className="min-h-[450px]">
            {lcsState ? (
              <LCSVisualization state={lcsState} />
            ) : (
              <div className="text-muted-foreground text-center">
                <p className="mb-2">Enter strings and click Find LCS</p>
                <p className="text-sm opacity-60">Dynamic programming for subsequence matching</p>
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

function LCSVisualization({ state }: { state: LCSState }) {
  return (
    <div className="w-full space-y-4 p-4 overflow-x-auto">
      {/* Strings display */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-10">S1:</span>
          <div className="flex gap-1">
            {state.str1.split('').map((char, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-8 h-8 rounded flex items-center justify-center font-mono font-bold",
                  state.matchedIndices.some(m => m.i === i)
                    ? "bg-neon-green/30 border border-neon-green text-neon-green"
                    : "bg-muted/30 border border-border"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-10">S2:</span>
          <div className="flex gap-1">
            {state.str2.split('').map((char, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-8 h-8 rounded flex items-center justify-center font-mono font-bold",
                  state.matchedIndices.some(m => m.j === i)
                    ? "bg-neon-green/30 border border-neon-green text-neon-green"
                    : "bg-muted/30 border border-border"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* DP Table */}
      <div className="text-xs overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 border border-border text-muted-foreground"></th>
              <th className="p-1.5 border border-border text-muted-foreground">∅</th>
              {state.str2.split('').map((char, j) => (
                <th key={j} className="p-1.5 border border-border text-primary">{char}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-1.5 border border-border text-muted-foreground">∅</td>
              {state.dp[0]?.map((cell, j) => (
                <td key={j} className="p-1.5 border border-border text-center w-8">{cell}</td>
              ))}
            </tr>
            {state.str1.split('').map((char, i) => (
              <tr key={i}>
                <td className="p-1.5 border border-border text-secondary">{char}</td>
                {state.dp[i + 1]?.map((cell, j) => {
                  const isCurrent = i + 1 === state.currentI && j === state.currentJ;
                  const isMatch = state.matchedIndices.some(m => m.i === i && m.j === j - 1);
                  
                  return (
                    <td
                      key={j}
                      className={cn(
                        "p-1.5 border border-border text-center w-8 transition-colors",
                        isCurrent && "bg-primary/30 text-primary font-bold",
                        isMatch && "bg-neon-green/20",
                        cell > 0 && !isCurrent && !isMatch && "bg-muted/20"
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

      {/* LCS Result */}
      {state.lcs && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 rounded-lg bg-neon-green/10 border border-neon-green/30"
        >
          <span className="text-sm text-muted-foreground">LCS: </span>
          <span className="font-display text-2xl font-bold text-neon-green tracking-wider">
            {state.lcs}
          </span>
        </motion.div>
      )}
    </div>
  );
}
