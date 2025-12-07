import { VisualizationStep, AlgorithmRunner } from '@/types/algorithm';

export interface NQueensInput {
  n: number;
  maxSolutions?: number;
  mode?: 'full' | 'sampling' | 'fast-solve';
  useBitmask?: boolean;
}

const MAX_N = 20; // Safety cap

// Bitmask-based isSafe check (faster)
function isSafeBitmask(row: number, col: number, cols: number, diag1: number, diag2: number): boolean {
  const colMask = 1 << col;
  const diag1Mask = 1 << (row - col + MAX_N);
  const diag2Mask = 1 << (row + col);
  
  return !(cols & colMask) && !(diag1 & diag1Mask) && !(diag2 & diag2Mask);
}

// Traditional isSafe check
function isSafeTraditional(row: number, col: number, board: number[]): boolean {
  for (let i = 0; i < row; i++) {
    const c = board[i];
    if (c === col) return false;
    if (Math.abs(c - col) === Math.abs(i - row)) return false;
  }
  return true;
}

export const nQueensRunner: AlgorithmRunner<NQueensInput> = {
  getInitialInput: () => ({
    n: 8,
    maxSolutions: 1,
    mode: 'full',
    useBitmask: false,
  }),

  generateSteps: (input: NQueensInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const n = Math.min(input.n, MAX_N);
    const maxSolutions = input.maxSolutions || 1;
    const useBitmask = input.useBitmask !== undefined ? input.useBitmask : n > 12;
    
    // Determine mode based on n
    let mode = input.mode;
    if (!mode) {
      if (n <= 12) {
        mode = 'full';
      } else if (n <= 16) {
        mode = 'sampling';
      } else {
        mode = 'fast-solve';
      }
    }

    steps.push({
      kind: 'init',
      payload: { n, board: Array(n).fill(-1), mode, maxSolutions, useBitmask },
      codeLine: 0,
      description: `Solving ${n}-Queens problem (${mode} mode, max ${maxSolutions} solution${maxSolutions > 1 ? 's' : ''})`,
    });

    const board: number[] = Array(n).fill(-1);
    const solutions: number[][] = [];
    let stepCount = 0;
    const MAX_STEPS = mode === 'full' ? 100000 : mode === 'sampling' ? 50000 : 10000;
    let lastSampledStep = -1;
    const samplingInterval = mode === 'sampling' ? Math.max(1, Math.floor(n / 4)) : 1;

    // Bitmask-based solver
    if (useBitmask && mode !== 'full') {
      function solveBitmask(row: number, cols: number, diag1: number, diag2: number): boolean {
        if (row === n) {
          solutions.push([...board]);
          steps.push({
            kind: 'solution-found',
            payload: { board: [...board], n, solutionNumber: solutions.length },
            codeLine: 16,
            description: `Solution ${solutions.length} found!`,
          });
          return solutions.length >= maxSolutions;
        }

        if (stepCount++ > MAX_STEPS) {
          steps.push({
            kind: 'step-limit',
            payload: { n, solutionsFound: solutions.length },
            codeLine: 0,
            description: `Step limit reached. Found ${solutions.length} solution(s).`,
          });
          return true;
        }

        const shouldSample = mode === 'full' || 
          (mode === 'sampling' && (row % samplingInterval === 0 || row === 0 || row === n - 1));

        if (shouldSample) {
          steps.push({
            kind: 'try-row',
            payload: { row, board: [...board], n },
            codeLine: 14,
            description: `Trying to place queen in row ${row}`,
          });
        }

        for (let col = 0; col < n; col++) {
          if (isSafeBitmask(row, col, cols, diag1, diag2)) {
            board[row] = col;

            if (shouldSample) {
              steps.push({
                kind: 'place-queen',
                payload: { row, col, board: [...board], n },
                codeLine: 22,
                description: `Place queen at (${row}, ${col})`,
              });
            }

            const newCols = cols | (1 << col);
            const newDiag1 = diag1 | (1 << (row - col + MAX_N));
            const newDiag2 = diag2 | (1 << (row + col));

            if (solveBitmask(row + 1, newCols, newDiag1, newDiag2)) {
              return true;
            }

            board[row] = -1;

            if (shouldSample) {
              steps.push({
                kind: 'backtrack',
                payload: { row, col, board: [...board], n },
                codeLine: 24,
                description: `Backtrack: remove queen from (${row}, ${col})`,
              });
            }
          }
        }

        return false;
      }

      solveBitmask(0, 0, 0, 0);
    } else {
      // Traditional solver
      function solveTraditional(row: number): boolean {
        if (row === n) {
          solutions.push([...board]);
          steps.push({
            kind: 'solution-found',
            payload: { board: [...board], n, solutionNumber: solutions.length },
            codeLine: 16,
            description: `Solution ${solutions.length} found!`,
          });
          return solutions.length >= maxSolutions;
        }

        if (stepCount++ > MAX_STEPS) {
          steps.push({
            kind: 'step-limit',
            payload: { n, solutionsFound: solutions.length },
            codeLine: 0,
            description: `Step limit reached. Found ${solutions.length} solution(s).`,
          });
          return true;
        }

        const shouldSample = mode === 'full' || 
          (mode === 'sampling' && (row % samplingInterval === 0 || row === 0 || row === n - 1));

        if (shouldSample) {
          steps.push({
            kind: 'try-row',
            payload: { row, board: [...board], n },
            codeLine: 14,
            description: `Trying to place queen in row ${row}`,
          });
        }

        for (let col = 0; col < n; col++) {
          const shouldCheck = mode === 'full' || col % Math.max(1, Math.floor(n / 4)) === 0 || col === 0 || col === n - 1;

          if (shouldCheck && shouldSample) {
            steps.push({
              kind: 'try-col',
              payload: { row, col, board: [...board], n },
              codeLine: 20,
              description: `Try column ${col} for row ${row}`,
            });
          }

          const safe = isSafeTraditional(row, col, board);

          if (shouldCheck && shouldSample) {
            steps.push({
              kind: 'check-safe',
              payload: { row, col, safe, board: [...board], n },
              codeLine: 21,
              description: safe
                ? `Position (${row}, ${col}) is safe`
                : `Position (${row}, ${col}) is not safe (attacks existing queen)`,
            });
          }

          if (safe) {
            board[row] = col;

            if (shouldSample) {
              steps.push({
                kind: 'place-queen',
                payload: { row, col, board: [...board], n },
                codeLine: 22,
                description: `Place queen at (${row}, ${col})`,
              });
            }

            if (solveTraditional(row + 1)) {
              return true;
            }

            board[row] = -1;

            if (shouldSample) {
              steps.push({
                kind: 'backtrack',
                payload: { row, col, board: [...board], n },
                codeLine: 24,
                description: `Backtrack: remove queen from (${row}, ${col})`,
              });
            }
          }
        }

        return false;
      }

      solveTraditional(0);
    }

    if (solutions.length === 0) {
      steps.push({
        kind: 'no-solution',
        payload: { n },
        codeLine: 29,
        description: `No solution found for ${n}-Queens`,
      });
    }

    steps.push({
      kind: 'complete',
      payload: { 
        board: solutions.length > 0 ? solutions[0] : board, 
        n, 
        solutionFound: solutions.length > 0,
        solutionsCount: solutions.length,
        allSolutions: solutions,
      },
      codeLine: 30,
      description: solutions.length > 0 
        ? `Algorithm complete - found ${solutions.length} solution(s)!` 
        : 'Algorithm complete - no solution exists',
    });

    return steps;
  },

  validateInput: (input: NQueensInput) => {
    if (!input.n || !Number.isInteger(input.n) || input.n < 1) {
      return { valid: false, error: 'N must be a positive integer' };
    }
    if (input.n > MAX_N) {
      return { valid: false, error: `N must be at most ${MAX_N} for safety` };
    }
    if (input.maxSolutions !== undefined && (input.maxSolutions < 1 || input.maxSolutions > 100)) {
      return { valid: false, error: 'Max solutions must be between 1 and 100' };
    }
    return { valid: true };
  },
};
