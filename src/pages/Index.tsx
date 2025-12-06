import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { 
  GitBranch, 
  Coins, 
  FileCode2, 
  Grid3X3,
  ArrowRight,
  Sparkles,
  Zap,
  Brain
} from 'lucide-react';

const categories = [
  {
    name: 'Divide & Conquer',
    description: 'Break problems into smaller subproblems',
    icon: GitBranch,
    color: 'from-neon-cyan to-blue-500',
    algorithms: [
      { name: 'Tower of Hanoi', path: '/algorithms/tower-of-hanoi' },
      { name: 'Closest Pair of Points', path: '/algorithms/closest-pair' },
    ],
  },
  {
    name: 'Greedy',
    description: 'Optimal local choices for global solution',
    icon: Coins,
    color: 'from-neon-green to-emerald-500',
    algorithms: [
      { name: 'Fractional Knapsack', path: '/algorithms/fractional-knapsack' },
      { name: 'Optimal Merge Pattern', path: '/algorithms/optimal-merge' },
    ],
  },
  {
    name: 'Dynamic Programming',
    description: 'Solve complex problems via overlapping subproblems',
    icon: FileCode2,
    color: 'from-neon-purple to-violet-500',
    algorithms: [
      { name: '0/1 Knapsack', path: '/algorithms/knapsack-01' },
      { name: 'LCS', path: '/algorithms/lcs' },
      { name: 'Bellman-Ford', path: '/algorithms/bellman-ford' },
    ],
  },
  {
    name: 'Backtracking',
    description: 'Explore all possibilities with constraint checking',
    icon: Grid3X3,
    color: 'from-neon-pink to-rose-500',
    algorithms: [
      { name: 'Sudoku Solver', path: '/algorithms/sudoku' },
      { name: 'Rat in Maze', path: '/algorithms/rat-in-maze' },
      { name: "Knight's Tour", path: '/algorithms/knights-tour' },
    ],
  },
];

const features = [
  {
    icon: Zap,
    title: 'Step-by-Step',
    description: 'Watch algorithms execute one step at a time',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Animations',
    description: 'Smooth, intuitive visualizations',
  },
  {
    icon: Brain,
    title: 'Learn Mode',
    description: 'Understand complexity and use cases',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 md:py-20"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Interactive Learning Platform</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="text-gradient neon-text">AlgoVision</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Master algorithms through beautiful, interactive visualizations. 
            Watch, learn, and understand complex concepts step by step.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-10"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="glass-card p-4 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Algorithm Categories */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="py-8"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
          Explore <span className="text-gradient">Algorithms</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                variants={itemVariants}
                className="glass-card-hover p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {category.algorithms.map((algo) => (
                    <Link
                      key={algo.path}
                      to={algo.path}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-border transition-all group"
                    >
                      <span className="font-medium">{algo.name}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Mind Map Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="py-12"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
          Algorithm <span className="text-gradient">Mind Map</span>
        </h2>
        
        <div className="glass-card p-8 overflow-x-auto">
          <MindMapSVG />
        </div>
      </motion.section>
    </Layout>
  );
}

function MindMapSVG() {
  return (
    <svg viewBox="0 0 900 500" className="w-full min-w-[600px] h-auto">
      {/* Connections */}
      <g stroke="hsl(184, 100%, 50%)" strokeWidth="2" fill="none" opacity="0.5">
        {/* Center to categories */}
        <path d="M 450 250 Q 350 180 250 120" />
        <path d="M 450 250 Q 550 180 650 120" />
        <path d="M 450 250 Q 350 320 250 380" />
        <path d="M 450 250 Q 550 320 650 380" />
        
        {/* Divide & Conquer branches */}
        <path d="M 250 120 Q 180 100 120 70" />
        <path d="M 250 120 Q 180 140 120 140" />
        
        {/* Greedy branches */}
        <path d="M 650 120 Q 720 100 780 70" />
        <path d="M 650 120 Q 720 140 780 140" />
        
        {/* DP branches */}
        <path d="M 250 380 Q 180 360 100 340" />
        <path d="M 250 380 Q 180 380 100 390" />
        <path d="M 250 380 Q 180 400 100 440" />
        
        {/* Backtracking branches */}
        <path d="M 650 380 Q 720 360 800 340" />
        <path d="M 650 380 Q 720 380 800 390" />
        <path d="M 650 380 Q 720 400 800 440" />
      </g>
      
      {/* Center node */}
      <g transform="translate(450, 250)">
        <circle r="50" fill="url(#centerGrad)" />
        <text textAnchor="middle" dy="5" fill="white" fontFamily="Orbitron" fontWeight="bold" fontSize="14">
          AlgoVision
        </text>
      </g>
      
      {/* Divide & Conquer */}
      <g transform="translate(250, 120)">
        <rect x="-60" y="-25" width="120" height="50" rx="12" fill="hsl(184, 100%, 50%)" opacity="0.2" stroke="hsl(184, 100%, 50%)" />
        <text textAnchor="middle" dy="5" fill="hsl(184, 100%, 50%)" fontSize="11" fontWeight="600">Divide & Conquer</text>
      </g>
      <g transform="translate(120, 70)">
        <rect x="-55" y="-15" width="110" height="30" rx="8" fill="hsl(184, 100%, 50%)" opacity="0.1" stroke="hsl(184, 100%, 50%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">Tower of Hanoi</text>
      </g>
      <g transform="translate(120, 140)">
        <rect x="-55" y="-15" width="110" height="30" rx="8" fill="hsl(184, 100%, 50%)" opacity="0.1" stroke="hsl(184, 100%, 50%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">Closest Pair</text>
      </g>
      
      {/* Greedy */}
      <g transform="translate(650, 120)">
        <rect x="-45" y="-25" width="90" height="50" rx="12" fill="hsl(150, 100%, 50%)" opacity="0.2" stroke="hsl(150, 100%, 50%)" />
        <text textAnchor="middle" dy="5" fill="hsl(150, 100%, 50%)" fontSize="11" fontWeight="600">Greedy</text>
      </g>
      <g transform="translate(780, 70)">
        <rect x="-65" y="-15" width="130" height="30" rx="8" fill="hsl(150, 100%, 50%)" opacity="0.1" stroke="hsl(150, 100%, 50%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">Fractional Knapsack</text>
      </g>
      <g transform="translate(780, 140)">
        <rect x="-55" y="-15" width="110" height="30" rx="8" fill="hsl(150, 100%, 50%)" opacity="0.1" stroke="hsl(150, 100%, 50%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">Optimal Merge</text>
      </g>
      
      {/* Dynamic Programming */}
      <g transform="translate(250, 380)">
        <rect x="-75" y="-25" width="150" height="50" rx="12" fill="hsl(276, 100%, 53%)" opacity="0.2" stroke="hsl(276, 100%, 53%)" />
        <text textAnchor="middle" dy="5" fill="hsl(276, 100%, 53%)" fontSize="11" fontWeight="600">Dynamic Programming</text>
      </g>
      <g transform="translate(100, 340)">
        <rect x="-50" y="-15" width="100" height="30" rx="8" fill="hsl(276, 100%, 53%)" opacity="0.1" stroke="hsl(276, 100%, 53%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">0/1 Knapsack</text>
      </g>
      <g transform="translate(100, 390)">
        <rect x="-30" y="-15" width="60" height="30" rx="8" fill="hsl(276, 100%, 53%)" opacity="0.1" stroke="hsl(276, 100%, 53%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">LCS</text>
      </g>
      <g transform="translate(100, 440)">
        <rect x="-50" y="-15" width="100" height="30" rx="8" fill="hsl(276, 100%, 53%)" opacity="0.1" stroke="hsl(276, 100%, 53%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">Bellman-Ford</text>
      </g>
      
      {/* Backtracking */}
      <g transform="translate(650, 380)">
        <rect x="-55" y="-25" width="110" height="50" rx="12" fill="hsl(320, 100%, 60%)" opacity="0.2" stroke="hsl(320, 100%, 60%)" />
        <text textAnchor="middle" dy="5" fill="hsl(320, 100%, 60%)" fontSize="11" fontWeight="600">Backtracking</text>
      </g>
      <g transform="translate(800, 340)">
        <rect x="-55" y="-15" width="110" height="30" rx="8" fill="hsl(320, 100%, 60%)" opacity="0.1" stroke="hsl(320, 100%, 60%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">Sudoku Solver</text>
      </g>
      <g transform="translate(800, 390)">
        <rect x="-45" y="-15" width="90" height="30" rx="8" fill="hsl(320, 100%, 60%)" opacity="0.1" stroke="hsl(320, 100%, 60%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">Rat in Maze</text>
      </g>
      <g transform="translate(800, 440)">
        <rect x="-50" y="-15" width="100" height="30" rx="8" fill="hsl(320, 100%, 60%)" opacity="0.1" stroke="hsl(320, 100%, 60%)" strokeOpacity="0.5" />
        <text textAnchor="middle" dy="4" fill="hsl(180, 100%, 97%)" fontSize="10">Knight's Tour</text>
      </g>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(184, 100%, 50%)" />
          <stop offset="100%" stopColor="hsl(276, 100%, 53%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
