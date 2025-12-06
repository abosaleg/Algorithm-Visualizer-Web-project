import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaybackSpeed } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  disabled?: boolean;
}

const speeds: PlaybackSpeed[] = ['slow', 'medium', 'fast'];

export function ControlPanel({
  isPlaying,
  isPaused,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onNextStep,
  onPrevStep,
  onReset,
  onSpeedChange,
  disabled = false,
}: ControlPanelProps) {
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card p-4"
    >
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStep + 1} of {totalSteps || 1}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={disabled}
            className="control-button"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevStep}
            disabled={disabled || currentStep === 0}
            className="control-button"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="lg"
            onClick={isPlaying ? onPause : onPlay}
            disabled={disabled || totalSteps === 0}
            className={cn(
              "control-button-primary w-14 h-14 rounded-full",
              isPlaying && "neon-glow"
            )}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextStep}
            disabled={disabled || currentStep >= totalSteps - 1}
            className="control-button"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Speed control */}
      <div className="flex items-center justify-center gap-4">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-2">
          {speeds.map((s) => (
            <motion.button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                speed === s
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
