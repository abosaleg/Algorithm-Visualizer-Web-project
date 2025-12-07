import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { NQueensInput } from "@/algorithms/runners/backtracking";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface NQueensInputPanelProps {
  onInputChange: (input: Record<string, unknown>) => void;
  className?: string;
  currentInput?: NQueensInput;
}

const PRESETS = [4, 8, 10, 12, 14];

export function NQueensInputPanel({
  onInputChange,
  className,
  currentInput,
}: NQueensInputPanelProps) {
  const [n, setN] = useState<string>(() => currentInput?.n?.toString() || "8");
  const [maxSolutions, setMaxSolutions] = useState<number>(
    currentInput?.maxSolutions || 1
  );
  const [mode, setMode] = useState<NQueensInput["mode"]>(
    currentInput?.mode || "full"
  );
  const [useBitmask, setUseBitmask] = useState<boolean>(
    currentInput?.useBitmask !== undefined ? currentInput.useBitmask : false
  );
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // Update local state when currentInput changes
  useEffect(() => {
    if (currentInput) {
      setN(currentInput.n?.toString() || "8");
      setMaxSolutions(currentInput.maxSolutions || 1);
      setMode(currentInput.mode || "full");
      setUseBitmask(
        currentInput.useBitmask !== undefined ? currentInput.useBitmask : false
      );
    }
  }, [currentInput]);

  // Auto-determine mode based on n
  useEffect(() => {
    const nValue = parseInt(n, 10);
    if (!isNaN(nValue)) {
      let newMode: NQueensInput["mode"] = "full";
      if (nValue <= 12) {
        newMode = "full";
      } else if (nValue <= 16) {
        newMode = "sampling";
      } else {
        newMode = "fast-solve";
      }
      setMode(newMode);

      // Auto-enable bitmask for larger n
      if (nValue > 12) {
        setUseBitmask(true);
      }

      // Set warnings
      if (nValue > 16) {
        setWarning(
          "Large input detected. Fast-solve mode will be used. Only key steps will be shown."
        );
      } else if (nValue > 12) {
        setWarning(
          "Large input detected. Sampling mode will be used for performance."
        );
      } else {
        setWarning("");
      }
    }
  }, [n]);

  const handleApply = useCallback(() => {
    const nValue = parseInt(n.trim(), 10);

    if (isNaN(nValue) || nValue < 1) {
      setError("N must be a positive integer");
      return;
    }

    if (nValue > 20) {
      setError("N must be at most 20 for safety");
      return;
    }

    if (maxSolutions < 1 || maxSolutions > 100) {
      setError("Max solutions must be between 1 and 100");
      return;
    }

    setError("");

    const payload: NQueensInput = {
      n: nValue,
      maxSolutions,
      mode,
      useBitmask,
    };

    onInputChange(payload as unknown as Record<string, unknown>);
  }, [n, maxSolutions, mode, useBitmask, onInputChange]);

  const handlePreset = useCallback(
    (preset: number) => {
      setN(preset.toString());
      setError("");
      const payload: NQueensInput = {
        n: preset,
        maxSolutions: 1,
        mode: preset <= 12 ? "full" : preset <= 16 ? "sampling" : "fast-solve",
        useBitmask: preset > 12,
      };
      onInputChange(payload as unknown as Record<string, unknown>);
    },
    [onInputChange]
  );

  const nValue = parseInt(n, 10);
  const estimatedComplexity = !isNaN(nValue) ? `O(${nValue}!)` : "O(N!)";

  return (
    <div className={cn("glass-panel p-4 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Input Configuration
        </h3>
      </div>

      <div className="space-y-3">
        {/* N input */}
        <div className="space-y-1.5">
          <Label htmlFor="n-input" className="text-xs text-muted-foreground">
            N (Board size: N×N)
          </Label>
          <Input
            id="n-input"
            type="number"
            min={1}
            max={20}
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="e.g., 8"
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

        {/* Max Solutions */}
        <div className="space-y-1.5">
          <Label
            htmlFor="max-solutions-input"
            className="text-xs text-muted-foreground"
          >
            Max Solutions
          </Label>
          <Input
            id="max-solutions-input"
            type="number"
            min={1}
            max={100}
            value={maxSolutions}
            onChange={(e) =>
              setMaxSolutions(Number.parseInt(e.target.value, 10) || 1)
            }
            className="font-mono text-sm bg-muted/50 border-panel-border"
          />
          <p className="text-xs text-muted-foreground">
            Maximum number of solutions to find (1-100)
          </p>
        </div>

        {/* Visualization Mode selector */}
        <div className="space-y-1.5">
          <Label
            htmlFor="mode-select"
            className="text-xs text-muted-foreground"
          >
            Visualization Mode
          </Label>
          <Select
            value={mode}
            onValueChange={(value: NQueensInput["mode"]) => setMode(value)}
          >
            <SelectTrigger
              id="mode-select"
              className="font-mono text-sm bg-muted/50 border-panel-border"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">
                Full Step-by-Step (N &lt;= 12)
              </SelectItem>
              <SelectItem value="sampling">
                Sampling Mode (12 &lt; N &lt;= 16)
              </SelectItem>
              <SelectItem value="fast-solve">
                Fast-solve Mode (N &gt; 16)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bitmask option */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Optimization</Label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="use-bitmask"
              checked={useBitmask}
              onChange={(e) => setUseBitmask(e.target.checked)}
              className="rounded border-panel-border"
            />
            <Label htmlFor="use-bitmask" className="text-xs cursor-pointer">
              Use Bitmask-based Backtracking (faster for large N)
            </Label>
          </div>
        </div>

        {/* Mode display */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Current Mode</Label>
          <div className="p-2 bg-muted/30 rounded text-xs font-mono">
            {mode === "full" && "Full Step-by-Step Mode (N <= 12)"}
            {mode === "sampling" && "Partial/Sampling Mode (12 < N <= 16)"}
            {mode === "fast-solve" && "Fast-solve Mode (N > 16)"}
          </div>
        </div>

        {/* Complexity estimate */}
        {!isNaN(nValue) && nValue > 0 && (
          <div className="p-2 bg-info/10 rounded text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Complexity:</span>
              <span className="font-mono">{estimatedComplexity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Space Complexity:</span>
              <span className="font-mono">O(N)</span>
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

        {error && <p className="text-xs text-destructive">{error}</p>}

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
