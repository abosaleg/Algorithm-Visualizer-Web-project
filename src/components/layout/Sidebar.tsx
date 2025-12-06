import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { 
  Layers, 
  GitBranch, 
  Coins, 
  FileStack, 
  Package, 
  FileCode2, 
  Route, 
  Grid3X3, 
  Rat, 
  Crown,
  Home,
  ChevronDown,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AlgorithmCategory {
  name: string;
  icon: React.ElementType;
  color: string;
  algorithms: {
    name: string;
    path: string;
    icon: React.ElementType;
  }[];
}

const categories: AlgorithmCategory[] = [
  {
    name: 'Divide & Conquer',
    icon: GitBranch,
    color: 'text-neon-cyan',
    algorithms: [
      { name: 'Tower of Hanoi', path: '/algorithms/tower-of-hanoi', icon: Layers },
      { name: 'Closest Pair', path: '/algorithms/closest-pair', icon: GitBranch },
    ],
  },
  {
    name: 'Greedy',
    icon: Coins,
    color: 'text-neon-green',
    algorithms: [
      { name: 'Fractional Knapsack', path: '/algorithms/fractional-knapsack', icon: Package },
      { name: 'Optimal Merge', path: '/algorithms/optimal-merge', icon: FileStack },
    ],
  },
  {
    name: 'Dynamic Programming',
    icon: FileCode2,
    color: 'text-neon-purple',
    algorithms: [
      { name: '0/1 Knapsack', path: '/algorithms/knapsack-01', icon: Package },
      { name: 'LCS', path: '/algorithms/lcs', icon: FileCode2 },
      { name: 'Bellman-Ford', path: '/algorithms/bellman-ford', icon: Route },
    ],
  },
  {
    name: 'Backtracking',
    icon: Grid3X3,
    color: 'text-neon-pink',
    algorithms: [
      { name: 'Sudoku Solver', path: '/algorithms/sudoku', icon: Grid3X3 },
      { name: 'Rat in Maze', path: '/algorithms/rat-in-maze', icon: Rat },
      { name: "Knight's Tour", path: '/algorithms/knights-tour', icon: Crown },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(c => c.name)
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end p-4">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/"
          className="algorithm-nav-item"
          activeClassName="active"
          onClick={onClose}
        >
          <Home className="h-5 w-5 text-primary" />
          <span className="font-medium">Home</span>
        </NavLink>

        <div className="h-px bg-border my-4" />

        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.name);
          const CategoryIcon = category.icon;

          return (
            <div key={category.name} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.name)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                  "transition-all duration-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon className={cn("h-5 w-5", category.color)} />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-4"
                  >
                    {category.algorithms.map((algo) => {
                      const AlgoIcon = algo.icon;
                      const isActive = location.pathname === algo.path;

                      return (
                        <NavLink
                          key={algo.path}
                          to={algo.path}
                          className="algorithm-nav-item text-sm"
                          activeClassName="active"
                          onClick={onClose}
                        >
                          <AlgoIcon className={cn(
                            "h-4 w-4",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span>{algo.name}</span>
                        </NavLink>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for learning
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 z-40"
      >
        <div className="glass-card w-full m-4 mr-0 rounded-l-none overflow-hidden">
          {sidebarContent}
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden"
            >
              <div className="glass-card h-full rounded-r-xl overflow-hidden">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
