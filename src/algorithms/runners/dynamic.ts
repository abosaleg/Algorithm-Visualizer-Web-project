import { VisualizationStep, AlgorithmRunner } from '@/types/algorithm';

export interface FibonacciInput {
  n: number;
  strategy?: 'iterative' | 'dp-array' | 'fast-doubling';
  detailLevel?: number; // 0-100, controls sampling for condensed mode
  mode?: 'full' | 'condensed' | 'computation-only';
}

// Fast doubling algorithm for very large n
function fastDoubling(n: number): bigint {
  if (n === 0) return BigInt(0);
  if (n === 1) return BigInt(1);

  function fibHelper(k: number): [bigint, bigint] {
    if (k === 0) return [BigInt(0), BigInt(1)];
    if (k === 1) return [BigInt(1), BigInt(1)];

    const [a, b] = fibHelper(Math.floor(k / 2));
    const c = a * (BigInt(2) * b - a);
    const d = b * b + a * a;

    if (k % 2 === 0) {
      return [c, d];
    } else {
      return [d, c + d];
    }
  }

  return fibHelper(n)[0];
}

// Iterative O(1) space
function iterativeFib(n: number): bigint {
  if (n <= 1) return BigInt(n);
  let a = BigInt(0);
  let b = BigInt(1);
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

export const fibonacciRunner: AlgorithmRunner<FibonacciInput> = {
  getInitialInput: () => ({
    n: 20,
    strategy: 'dp-array',
    detailLevel: 50,
    mode: 'full',
  }),

  generateSteps: (input: FibonacciInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const n = input.n;
    const strategy = input.strategy || 'dp-array';
    const detailLevel = input.detailLevel || 50;
    
    // Determine mode based on n
    let mode = input.mode;
    if (!mode) {
      if (n <= 50) {
        mode = 'full';
      } else if (n <= 10000) {
        mode = 'condensed';
      } else {
        mode = 'computation-only';
      }
    }

    // Safety caps
    const MAX_DETAILED_STEPS = 2000;
    const MAX_DP_ARRAY_SIZE = 10000;

    // Estimate memory and time
    const estimatedMemory = n * 8; // bytes (assuming 8 bytes per number)
    const estimatedTime = n * 0.001; // rough estimate in ms

    steps.push({
      kind: 'init',
      payload: { 
        n, 
        mode,
        strategy,
        estimatedMemory,
        estimatedTime,
        warning: n > MAX_DP_ARRAY_SIZE ? 'Large input detected. Using computation-only mode.' : undefined,
      },
      codeLine: 0,
      description: `Computing Fibonacci(${n}) using ${strategy} strategy in ${mode} mode`,
    });

    // Base cases
    if (n <= 1) {
      steps.push({
        kind: 'base-case',
        payload: { n, result: n, dp: [n] },
        codeLine: 2,
        description: `Base case: Fibonacci(${n}) = ${n}`,
      });

      steps.push({
        kind: 'complete',
        payload: { n, result: n, dp: [n] },
        codeLine: 15,
        description: `Result: Fibonacci(${n}) = ${n}`,
      });

      return steps;
    }

    // Computation-only mode for very large n
    if (mode === 'computation-only' || n > MAX_DP_ARRAY_SIZE) {
      steps.push({
        kind: 'compute-start',
        payload: { n, strategy: 'fast-doubling' },
        codeLine: 0,
        description: `Computing Fibonacci(${n}) using fast doubling algorithm...`,
      });

      const result = fastDoubling(n);
      
      steps.push({
        kind: 'complete',
        payload: { n, result: result.toString(), mode: 'computation-only' },
        codeLine: 0,
        description: `Result: Fibonacci(${n}) = ${result.toString()}`,
      });

      return steps;
    }

    // Iterative O(1) space strategy
    if (strategy === 'iterative') {
      let a = 0;
      let b = 1;

      steps.push({
        kind: 'init-dp',
        payload: { dp: [0, 1], n, strategy: 'iterative' },
        codeLine: 6,
        description: `Initialize: a = 0, b = 1`,
      });

      const sampleRate = mode === 'condensed' ? Math.max(1, Math.floor(n / (100 - detailLevel))) : 1;

      for (let i = 2; i <= n; i++) {
        const shouldSample = i % sampleRate === 0 || i === n || i <= 10;

        if (shouldSample) {
          steps.push({
            kind: 'compute',
            payload: {
              i,
              prev1: b,
              prev2: a,
              dp: [a, b],
              n,
              strategy: 'iterative',
            },
            codeLine: 10,
            description: `Computing F(${i}) = F(${i - 1}) + F(${i - 2}) = ${b} + ${a}`,
          });
        }

        const temp = a + b;
        a = b;
        b = temp;

        if (shouldSample) {
          steps.push({
            kind: 'store',
            payload: {
              i,
              value: b,
              dp: [a, b],
              n,
              strategy: 'iterative',
            },
            codeLine: 11,
            description: `F(${i}) = ${b}`,
          });
        }
      }

      steps.push({
        kind: 'complete',
        payload: { n, result: b, dp: [a, b] },
        codeLine: 14,
        description: `Result: Fibonacci(${n}) = ${b}`,
      });

      return steps;
    }

    // DP Array strategy (for full visualization)
    const dp: (number | bigint)[] = new Array(Math.min(n + 1, MAX_DP_ARRAY_SIZE)).fill(0);
    dp[0] = 0;
    dp[1] = 1;

    // Use BigInt for large numbers
    const useBigInt = n > 78; // Fibonacci(78) exceeds safe integer range
    if (useBigInt) {
      dp[0] = BigInt(0);
      dp[1] = BigInt(1);
    }

    steps.push({
      kind: 'init-dp',
      payload: { dp: dp.map(v => v.toString()), n, strategy: 'dp-array', useBigInt },
      codeLine: 6,
      description: `Initialize DP table: dp[0] = 0, dp[1] = 1${useBigInt ? ' (using BigInt)' : ''}`,
    });

    const sampleRate = mode === 'condensed' 
      ? Math.max(1, Math.floor(n / Math.max(1, (100 - detailLevel) * 10))) 
      : 1;

    for (let i = 2; i <= n && i <= MAX_DP_ARRAY_SIZE; i++) {
      const shouldSample = mode === 'full' || i % sampleRate === 0 || i === n || i <= 10;

      if (shouldSample) {
        const prev1 = useBigInt ? (dp[i - 1] as bigint) : (dp[i - 1] as number);
        const prev2 = useBigInt ? (dp[i - 2] as bigint) : (dp[i - 2] as number);
        
        steps.push({
          kind: 'compute',
          payload: {
            i,
            prev1: prev1.toString(),
            prev2: prev2.toString(),
            dp: dp.map(v => v.toString()),
            n,
            strategy: 'dp-array',
          },
          codeLine: 10,
          description: `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${prev1} + ${prev2}`,
        });
      }

      if (useBigInt) {
        dp[i] = (dp[i - 1] as bigint) + (dp[i - 2] as bigint);
      } else {
        dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);
      }

      if (shouldSample) {
        steps.push({
          kind: 'store',
          payload: {
            i,
            value: dp[i].toString(),
            dp: dp.map(v => v.toString()),
            n,
            strategy: 'dp-array',
          },
          codeLine: 11,
          description: `Store dp[${i}] = ${dp[i]}`,
        });
      }
    }

    // If n exceeds array size, compute final result using fast doubling
    if (n > MAX_DP_ARRAY_SIZE) {
      const result = fastDoubling(n);
      steps.push({
        kind: 'complete',
        payload: { n, result: result.toString(), dp: dp.map(v => v.toString()), mode: 'computation-only' },
        codeLine: 14,
        description: `Result: Fibonacci(${n}) = ${result.toString()} (computed using fast doubling)`,
      });
    } else {
      steps.push({
        kind: 'complete',
        payload: { n, result: dp[n].toString(), dp: dp.map(v => v.toString()) },
        codeLine: 14,
        description: `Result: Fibonacci(${n}) = ${dp[n]}`,
      });
    }

    return steps;
  },

  validateInput: (input: FibonacciInput) => {
    if (!Number.isInteger(input.n) || input.n < 0) {
      return { valid: false, error: 'N must be a non-negative integer' };
    }
    if (input.n > 1000000) {
      return { valid: false, error: 'N must be less than 1,000,000 for safety' };
    }
    if (input.detailLevel !== undefined && (input.detailLevel < 0 || input.detailLevel > 100)) {
      return { valid: false, error: 'Detail level must be between 0 and 100' };
    }
    return { valid: true };
  },
};
