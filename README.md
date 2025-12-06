# AlgoVision — Algorithm Visualization Platform

An interactive web-based platform for visualizing and learning complex algorithms through step-by-step animated demonstrations.

## 🎯 Overview

AlgoVision provides an intuitive interface to understand algorithms across multiple categories including divide-and-conquer, greedy, dynamic programming, and backtracking approaches. Each algorithm includes detailed visualizations, pseudocode, complexity analysis, and real-world use cases.

## ✨ Features

- **Interactive Visualizations**: Step-by-step animated algorithm execution
- **Multiple Algorithm Categories**:
  - Divide & Conquer (Tower of Hanoi, Closest Pair)
  - Greedy Algorithms (Fractional Knapsack, Optimal Merge Pattern)
  - Dynamic Programming (0/1 Knapsack, LCS, Bellman-Ford)
  - Backtracking (Sudoku Solver, Knight's Tour, Rat in Maze)
- **Playback Controls**: Play, pause, step through, adjust speed
- **Learning Resources**: Pseudocode, time/space complexity, and use cases
- **Theme Support**: Light and dark mode toggle
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Build Tool**: Vite
- **Routing**: React Router
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Package Manager**: Bun

## 📦 Project Structure

```
src/
├── components/
│   ├── layout/          # Navigation, Sidebar, Layout wrapper
│   ├── ui/              # Reusable UI components (Input, Button, etc.)
│   └── visualization/   # Algorithm visualization components
├── pages/
│   ├── algorithms/      # Individual algorithm pages
│   ├── Index.tsx        # Home page
│   └── NotFound.tsx     # 404 page
├── hooks/
│   ├── useVisualization.ts   # Main visualization state management
│   ├── useTheme.ts           # Theme management
│   └── use-mobile.tsx        # Mobile detection
├── types/
│   └── algorithm.ts     # TypeScript interfaces for algorithms
├── lib/
│   └── utils.ts         # Utility functions
└── App.tsx              # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Bun package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd algorithm-visualizer

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev

# Open browser and navigate to http://localhost:5173
```

### Build

```bash
# Create production build
bun run build

# Preview production build
bun run preview
```

## 📚 Available Algorithms

### Divide & Conquer
- **Tower of Hanoi** - Classic recursive problem: $O(2^n)$ time complexity
- **Closest Pair of Points** - Find two nearest points in 2D space: $O(n \log n)$ time

### Greedy Algorithms
- **Fractional Knapsack** - Maximize value with fractional items: $O(n \log n)$ time
- **Optimal Merge Pattern** - Merge files with minimum cost: $O(n \log n)$ time

### Dynamic Programming
- **0/1 Knapsack** - Maximize value with whole items: $O(n \times W)$ time
- **Longest Common Subsequence (LCS)** - Find longest common subsequence: $O(m \times n)$ time
- **Bellman-Ford** - Shortest paths with negative weights: $O(V \times E)$ time

### Backtracking
- **Sudoku Solver** - Solve 9×9 sudoku puzzles: $O(9^{n^2})$ time
- **Knight's Tour** - Visit all chessboard squares: $O(8^{n^2})$ time
- **Rat in Maze** - Find path from start to end: $O(2^{n^2})$ time

## 🎮 How to Use

1. **Select an Algorithm**: Browse categories in the sidebar or homepage
2. **Configure Parameters**: Adjust algorithm inputs in the left panel
3. **Start Visualization**: Click "Start Algorithm" button
4. **Control Playback**:
   - Play/Pause execution
   - Step forward/backward through steps
   - Adjust playback speed (slow/medium/fast)
5. **View Results**: See final results and statistics in the results panel
6. **Learn**: Read pseudocode and complexity analysis in Learn Mode

## 🎨 Customization

### Adding New Algorithms

1. Create new file in `src/pages/algorithms/YourAlgorithm.tsx`
2. Define `AlgorithmConfig`, state interface, and step generation function
3. Create visualization component
4. Add route to router configuration
5. Add to sidebar categories in `src/components/layout/Sidebar.tsx`

### Theming

Edit `tailwind.config.ts` to customize:
- Color palette
- Font families
- Breakpoints

## 📖 Component Documentation

### [`useVisualization`](src/hooks/useVisualization.ts)
Main hook for managing visualization state and playback controls.

### [`AlgorithmInfo`](src/components/visualization/AlgorithmInfo.tsx)
Displays algorithm details including pseudocode and complexity analysis.

### [`ResultPanel`](src/components/visualization/ResultPanel.tsx)
Shows algorithm results and current execution state.

### [`Layout`](src/components/layout/Layout.tsx)
Main layout wrapper with navbar and sidebar.

## 🔧 Configuration

### Algorithm Config Structure

```typescript
const config: AlgorithmConfig = {
  id: 'unique-id',
  name: 'Algorithm Name',
  category: 'divide-conquer',
  description: 'Algorithm description',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  pseudocode: ['line 1', 'line 2', ...],
  useCases: ['use case 1', 'use case 2', ...],
};
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by algorithm visualization tools and educational platforms
- Built with modern web technologies and best practices
- Icons from Lucide React
- UI components from shadcn/ui

## 📧 Contact & Support

For questions, issues, or suggestions, please open an issue in the repository.

---

**Happy Learning! 🚀**