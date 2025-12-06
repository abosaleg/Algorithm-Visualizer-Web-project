import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Clock, 
  Lightbulb,
  ChevronDown 
} from 'lucide-react';
import { AlgorithmConfig } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface AlgorithmInfoProps {
  config: AlgorithmConfig;
}

export function AlgorithmInfo({ config }: AlgorithmInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-display font-semibold">Learn Mode</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 border-t border-border">
              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-neon-orange" />
                  Definition
                </h4>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>

              {/* Complexity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Time Complexity</span>
                  </div>
                  <code className="text-sm font-mono text-primary">{config.timeComplexity}</code>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-secondary" />
                    <span className="text-xs text-muted-foreground">Space Complexity</span>
                  </div>
                  <code className="text-sm font-mono text-secondary">{config.spaceComplexity}</code>
                </div>
              </div>

              {/* Pseudocode */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4 text-neon-green" />
                  Pseudocode
                </h4>
                <pre className="p-3 rounded-lg bg-muted/30 border border-border text-xs font-mono overflow-x-auto">
                  {config.pseudocode.map((line, i) => (
                    <div key={i} className={cn(
                      "py-0.5",
                      line.startsWith('  ') && "pl-4",
                      line.startsWith('    ') && "pl-8"
                    )}>
                      <span className="text-muted-foreground mr-3">{i + 1}</span>
                      {line}
                    </div>
                  ))}
                </pre>
              </div>

              {/* Use Cases */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Use Cases</h4>
                <ul className="space-y-2">
                  {config.useCases.map((useCase, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
