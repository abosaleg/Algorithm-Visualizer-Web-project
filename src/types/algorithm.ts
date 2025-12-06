// Algorithm types and interfaces
export interface AlgorithmStep {
  id: number;
  description: string;
  data: any;
  highlight?: number[];
  isValid?: boolean;
}

export interface AlgorithmResult {
  success: boolean;
  message: string;
  timeComplexity: string;
  spaceComplexity: string;
  iterations: number;
  finalValue?: any;
}

export interface AlgorithmConfig {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
  useCases: string[];
}

export type AlgorithmCategory = 
  | 'divide-conquer' 
  | 'greedy' 
  | 'dynamic-programming' 
  | 'backtracking';

export type PlaybackSpeed = 'slow' | 'medium' | 'fast';

export interface VisualizationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: PlaybackSpeed;
  steps: AlgorithmStep[];
  result: AlgorithmResult | null;
}

export const SPEED_MAP: Record<PlaybackSpeed, number> = {
  slow: 1500,
  medium: 800,
  fast: 300,
};
