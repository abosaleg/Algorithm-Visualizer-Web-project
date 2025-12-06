import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Database, Repeat } from 'lucide-react';
import { AlgorithmResult } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface ResultPanelProps {
  result: AlgorithmResult | null;
  currentState?: string;
  className?: string;
}

export function ResultPanel({ result, currentState, className }: ResultPanelProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn("glass-card p-4 space-y-4", className)}
    >
      <h3 className="font-display text-lg font-semibold text-gradient">Results</h3>

      {/* Current State */}
      {currentState && (
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Current State</p>
          <p className="font-mono text-sm">{currentState}</p>
        </div>
      )}

      {/* Result Status */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={cn(
              "p-4 rounded-lg border flex items-start gap-3",
              result.success
                ? "bg-neon-green/10 border-neon-green/30"
                : "bg-destructive/10 border-destructive/30"
            )}
          >
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 text-neon-green flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={cn(
                "font-medium",
                result.success ? "text-neon-green" : "text-destructive"
              )}>
                {result.success ? "Success!" : "Failed"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complexity Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Time</span>
          </div>
          <p className="font-mono text-sm text-primary">
            {result?.timeComplexity || 'O(?)'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Database className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Space</span>
          </div>
          <p className="font-mono text-sm text-secondary">
            {result?.spaceComplexity || 'O(?)'}
          </p>
        </div>
      </div>

      {/* Iterations */}
      {result && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
          <Repeat className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Iterations
            </span>
            <p className="font-mono text-lg font-bold text-gradient">
              {result.iterations}
            </p>
          </div>
        </div>
      )}

      {/* Final Value */}
      {result?.finalValue !== undefined && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-sm text-muted-foreground mb-1">Final Result</p>
          <p className="font-mono text-lg font-bold text-primary">
            {typeof result.finalValue === 'object' 
              ? JSON.stringify(result.finalValue) 
              : String(result.finalValue)}
          </p>
        </div>
      )}
    </motion.div>
  );
}
