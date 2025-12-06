import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  VisualizationState, 
  AlgorithmStep, 
  AlgorithmResult, 
  PlaybackSpeed, 
  SPEED_MAP 
} from '@/types/algorithm';

const initialState: VisualizationState = {
  isPlaying: false,
  isPaused: false,
  currentStep: 0,
  totalSteps: 0,
  speed: 'medium',
  steps: [],
  result: null,
};

export function useVisualization() {
  const [state, setState] = useState<VisualizationState>(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepsRef = useRef<AlgorithmStep[]>([]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const setSteps = useCallback((steps: AlgorithmStep[]) => {
    stepsRef.current = steps;
    setState(prev => ({
      ...prev,
      steps,
      totalSteps: steps.length,
      currentStep: 0,
      result: null,
    }));
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(stepIndex, prev.totalSteps - 1)),
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep >= prev.totalSteps - 1) {
        return { ...prev, isPlaying: false };
      }
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const play = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      result: null,
    }));
  }, [clearTimer]);

  const setSpeed = useCallback((speed: PlaybackSpeed) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const setResult = useCallback((result: AlgorithmResult) => {
    setState(prev => ({ ...prev, result }));
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (state.isPlaying && state.currentStep < state.totalSteps - 1) {
      timeoutRef.current = setTimeout(() => {
        nextStep();
      }, SPEED_MAP[state.speed]);
    } else if (state.isPlaying && state.currentStep >= state.totalSteps - 1) {
      setState(prev => ({ ...prev, isPlaying: false }));
    }

    return () => clearTimer();
  }, [state.isPlaying, state.currentStep, state.totalSteps, state.speed, nextStep, clearTimer]);

  return {
    state,
    setSteps,
    goToStep,
    nextStep,
    prevStep,
    play,
    pause,
    reset,
    setSpeed,
    setResult,
    currentStepData: state.steps[state.currentStep] || null,
  };
}
