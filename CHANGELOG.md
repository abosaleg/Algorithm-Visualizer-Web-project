# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

#### Fibonacci Sequence (DP) Algorithm
- **Dynamic Input Configuration**
  - Number input field with validation
  - Quick preset buttons (10, 20, 50, 100, 1000)
  - Auto-mode detection based on input size
  
- **Multiple Visualization Modes**
  - Full Step Visualization (n ≤ 50): Complete step-by-step visualization
  - Condensed/Streaming Mode (50 < n ≤ 10000): Sampled visualization with Detail Level slider
  - Computation-only Mode (n > 10000): Fast computation without detailed steps
  
- **Multiple Compute Strategies**
  - Iterative O(1) Space: Memory-efficient for large n
  - DP Array O(n) Space: Full table visualization
  - Fast Doubling: Matrix exponentiation for very large n
  
- **Advanced Features**
  - BigInt support for numbers exceeding safe integer range
  - Memory and time estimates before execution
  - Safety caps and warnings
  - Auto-strategy selection based on input size

#### N-Queens Problem Algorithm
- **Dynamic Input Configuration**
  - Board size input (N) with validation (1 ≤ N ≤ 20)
  - Quick preset buttons (4, 8, 10, 12, 14)
  - Max Solutions selector (1-100)
  - Visualization Mode selector
  
- **Multiple Visualization Modes**
  - Full Step-by-Step Mode (N ≤ 12): Detailed placements, conflicts, backtracks
  - Partial/Sampling Mode (12 < N ≤ 16): Sampled steps for performance
  - Fast-solve Mode (N > 16): Fast computation with key steps only
  
- **Advanced Features**
  - Bitmask-based backtracking for performance optimization
  - Multiple solutions support
  - Auto-mode switching based on N
  - Safety caps to prevent OOM and long blocking

#### Enhanced Components
- **FibonacciInputPanel**: Comprehensive input panel with strategy selection, mode display, and estimates
- **NQueensInputPanel**: Input panel with mode selection, bitmask option, and solution limits
- **Enhanced DPVisualizer**: Support for computation-only mode and BigInt results
- **Enhanced GridVisualizer**: Support for multiple solutions and solution counting

### Changed
- Updated algorithm names in config to exact requirements:
  - "Fibonacci (DP)" → "Fibonacci Sequence (DP)"
  - "N-Queens" → "N-Queens Problem"
- Enhanced code implementations with multiple strategies
- Improved visualizers to handle new step types and modes

### Technical Details
- All algorithms integrate with universal execution controller (Run/Step/Pause/Reset/Speed)
- Code panels support JavaScript, Python, and Pseudocode
- Comprehensive input validation and error handling
- Performance optimizations for large inputs
- Safety mechanisms to prevent browser freezing

### Testing
- Comprehensive QA checklist created (see QA_CHECKLIST.md)
- Test scenarios for all modes and edge cases
- Performance benchmarks documented

---

## Previous Versions
(History before this update)



