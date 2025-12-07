import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { FibonacciInput } from '@/algorithms/runners/dynamic';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface FibonacciInputPanelProps {
  onInputChange: (input: Record<string, unknown>) => void;
  className?: string;
  currentInput?: FibonacciInput;
}

const PRESETS = [10, 20, 50, 100, 1000];

export function FibonacciInputPanel({ onInputChange, className, currentInput }: FibonacciInputPanelProps) {
  const [n, setN] = useState<string>(() => currentInput?.n?.toString() || '20');
  const [strategy, setStrategy] = useState<FibonacciInput['strategy']>(currentInput?.strategy || 'dp-array');
  const [detailLevel, setDetailLevel] = useState<number>(currentInput?.detailLevel || 50);
  const [mode, setMode] = useState<FibonacciInput['mode']>(currentInput?.mode || 'full');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  // Update local state when currentInput changes
  useEffect(() => {
    if (currentInput) {
      setN(currentInput.n?.toString() || '20');
      setStrategy(currentInput.strategy || 'dp-array');
      setDetailLevel(currentInput.detailLevel || 50);
      setMode(currentInput.mode || 'full');
    }
  }, [currentInput]);

  // Auto-determine mode based on n
  useEffect(() => {
    const nValue = parseInt(n, 10);
    if (!isNaN(nValue)) {
      let newMode: FibonacciInput['mode'] = 'full';
      if (nValue <= 50) {
        newMode = 'full';
      } else if (nValue <= 10000) {
        newMode = 'condensed';
      } else {
        newMode = 'computation-only';
      }
      setMode(newMode);
      
      // Set warnings
      if (nValue > 10000) {
        setWarning('Large input detected. Computation-only mode will be used for performance.');
      } else if (nValue > 2000) {
        setWarning('Large input detected. Detailed step generation may be limited.');
      } else {
        setWarning('');
      }
    }
  }, [n]);

  const handleApply = useCallback(() => {
    const nValue = parseInt(n.trim(), 10);
    
    if (isNaN(nValue) || nValue < 0) {
      setError('N must be a non-negative integer');
      return;
    }
    
    if (nValue > 1000000) {
      setError('N must be less than 1,000,000 for safety');
      return;
    }

    setError('');
    
    const input: FibonacciInput = {
      n: nValue,
      strategy,
      detailLevel,
      mode,
    };

    onInputChange(input);
  }, [n, strategy, detailLevel, mode, onInputChange]);

  const handlePreset = useCallback((preset: number) => {
    setN(preset.toString());
    setError('');
    const input: FibonacciInput = {
      n: preset,
      strategy: preset > 1000 ? 'fast-doubling' : 'dp-array',
      detailLevel: preset > 50 ? 30 : 50,
      mode: preset <= 50 ? 'full' : preset <= 10000 ? 'condensed' : 'computation-only',
    };
    onInputChange(input);
  }, [onInputChange]);

  const nValue = parseInt(n, 10);
  const estimatedMemory = !isNaN(nValue) ? (nValue * 8 / 1024).toFixed(2) : '0';
  const estimatedTime = !isNaN(nValue) ? (nValue * 0.001).toFixed(2) : '0';

  return (
    <div className={cn('glass-panel p-4 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Input Configuration</h3>
      </div>

      <div className="space-y-3">
        {/* N input */}
        <div className="space-y-1.5">
          <Label htmlFor="n-input" className="text-xs text-muted-foreground">
            N (Fibonacci number to compute)
          </Label>
          <Input
            id="n-input"
            type="number"
            min="0"
            max="1000000"
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="e.g., 20"
            className="font-mono text-sm bg-muted/50 border-panel-border"
          />
        </div>

        {/* Presets */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => handlePreset(preset)}
                className="h-8 text-xs border-panel-border hover:border-secondary hover:text-secondary"
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        {/* Strategy selector */}
        <div className="space-y-1.5">
          <Label htmlFor="strategy-select" className="text-xs text-muted-foreground">
            Algorithm Strategy
          </Label>
          <Select
            value={strategy}
            onValueChange={(value: FibonacciInput['strategy']) => setStrategy(value)}
          >
            <SelectTrigger id="strategy-select" className="font-mono text-sm bg-muted/50 border-panel-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iterative">Iterative O(1) Space</SelectItem>
              <SelectItem value="dp-array">DP Array O(n) Space</SelectItem>
              <SelectItem value="fast-doubling">Fast Doubling (Large n)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mode display (auto-determined) */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Visualization Mode</Label>
          <div className="p-2 bg-muted/30 rounded text-xs font-mono">
            {mode === 'full' && 'Full Step Visualization (n ≤ 50)'}
            {mode === 'condensed' && 'Condensed/Streaming Mode (50 < n ≤ 10000)'}
            {mode === 'computation-only' && 'Computation-only Mode (n > 10000)'}
          </div>
        </div>

        {/* Detail Level slider (for condensed mode) */}
        {mode === 'condensed' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">Detail Level</Label>
              <span className="text-xs font-mono">{detailLevel}%</span>
            </div>
            <Slider
              value={[detailLevel]}
              onValueChange={(value) => setDetailLevel(value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls sampling rate for condensed visualization
            </p>
          </div>
        )}

        {/* Estimates */}
        {!isNaN(nValue) && nValue > 0 && (
          <div className="p-2 bg-info/10 rounded text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Memory:</span>
              <span className="font-mono">{estimatedMemory} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Time:</span>
              <span className="font-mono">{estimatedTime} ms</span>
            </div>
          </div>
        )}

        {/* Warnings */}
        {warning && (
          <Alert className="border-warning/50 bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-xs text-warning">
              {warning}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <Button
          onClick={handleApply}
          className="w-full h-9 gap-2 bg-primary/80 hover:bg-primary"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}



