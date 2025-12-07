# QA Checklist - Algorithm Visualizer

## Fibonacci Sequence (DP)

### Test Scenarios

#### Scenario 1: Small Input (n=10) - Full Mode
- **Input**: n = 10
- **Expected Mode**: Full Step Visualization
- **Strategy**: DP Array
- **Expected Behavior**:
  - All steps should be visualized
  - DP table should show all values from F(0) to F(10)
  - Result should be 55
  - No warnings should appear
- **Steps to Test**:
  1. Navigate to Fibonacci Sequence (DP) page
  2. Enter n = 10 or click preset "10"
  3. Click Apply
  4. Click Run
  5. Verify all steps are shown
  6. Verify final result is 55

#### Scenario 2: Medium Input (n=100) - Condensed Mode
- **Input**: n = 100
- **Expected Mode**: Condensed/Streaming Mode
- **Strategy**: DP Array
- **Detail Level**: 50 (default)
- **Expected Behavior**:
  - Steps should be sampled based on detail level
  - DP table should show key values
  - Result should be computed correctly
  - Warning about large input may appear
- **Steps to Test**:
  1. Navigate to Fibonacci Sequence (DP) page
  2. Enter n = 100 or click preset "100"
  3. Adjust Detail Level slider to 50
  4. Click Apply
  5. Click Run
  6. Verify condensed visualization
  7. Verify result is correct

#### Scenario 3: Large Input (n=100000) - Computation-only Mode
- **Input**: n = 100000
- **Expected Mode**: Computation-only Mode
- **Strategy**: Fast Doubling (auto-selected)
- **Expected Behavior**:
  - Should show computation-only message
  - No detailed steps
  - Result should be computed using BigInt
  - Warning about large input should appear
- **Steps to Test**:
  1. Navigate to Fibonacci Sequence (DP) page
  2. Enter n = 100000
  3. Click Apply
  4. Verify mode switches to computation-only
  5. Click Run
  6. Verify result is computed (may take a moment)
  7. Verify BigInt result is displayed

#### Scenario 4: Strategy Testing - Iterative O(1) Space
- **Input**: n = 20
- **Strategy**: Iterative
- **Expected Behavior**:
  - Should use O(1) space algorithm
  - Should show minimal DP table (only last 2 values)
  - Result should be correct
- **Steps to Test**:
  1. Navigate to Fibonacci Sequence (DP) page
  2. Enter n = 20
  3. Select "Iterative O(1) Space" strategy
  4. Click Apply
  5. Click Run
  6. Verify iterative visualization

#### Scenario 5: Base Cases
- **Input**: n = 0, n = 1
- **Expected Behavior**:
  - Should handle base cases correctly
  - Should show base case step
  - Result should be 0 for n=0, 1 for n=1
- **Steps to Test**:
  1. Test n = 0
  2. Test n = 1
  3. Verify base case handling

### Edge Cases
- **Negative Input**: Should show error
- **Very Large Input (n > 1000000)**: Should show error
- **Invalid Detail Level**: Should validate range 0-100

---

## N-Queens Problem

### Test Scenarios

#### Scenario 1: Small Board (N=4) - Full Mode, All Solutions
- **Input**: N = 4, Max Solutions = 10
- **Expected Mode**: Full Step-by-Step Mode
- **Expected Behavior**:
  - Should show all placement attempts
  - Should find all solutions (2 solutions for N=4)
  - Should show backtracking steps
  - Board visualization should update correctly
- **Steps to Test**:
  1. Navigate to N-Queens Problem page
  2. Enter N = 4 or click preset "4"
  3. Set Max Solutions = 10
  4. Click Apply
  5. Click Run
  6. Verify all solutions are found
  7. Verify backtracking is shown

#### Scenario 2: Standard Board (N=8) - Full Mode
- **Input**: N = 8, Max Solutions = 1
- **Expected Mode**: Full Step-by-Step Mode
- **Expected Behavior**:
  - Should show detailed placement steps
  - Should find first solution
  - Should show safe/unsafe checks
  - Should show backtracking when needed
- **Steps to Test**:
  1. Navigate to N-Queens Problem page
  2. Enter N = 8 or click preset "8"
  3. Set Max Solutions = 1 (default)
  4. Click Apply
  5. Click Run
  6. Verify full step-by-step visualization
  7. Verify solution is found

#### Scenario 3: Medium Board (N=14) - Fast-solve Mode
- **Input**: N = 14, Max Solutions = 1
- **Expected Mode**: Fast-solve Mode
- **Expected Behavior**:
  - Should use bitmask optimization
  - Should show key steps only
  - Should find solution quickly
  - Warning about fast-solve mode should appear
- **Steps to Test**:
  1. Navigate to N-Queens Problem page
  2. Enter N = 14 or click preset "14"
  3. Verify mode switches to fast-solve
  4. Verify bitmask is auto-enabled
  5. Click Apply
  6. Click Run
  7. Verify fast computation
  8. Verify solution is found

#### Scenario 4: Sampling Mode (N=12)
- **Input**: N = 12, Max Solutions = 1
- **Expected Mode**: Sampling Mode (or Full if N=12)
- **Expected Behavior**:
  - Should sample steps for performance
  - Should show key placement attempts
  - Should find solution
- **Steps to Test**:
  1. Navigate to N-Queens Problem page
  2. Enter N = 12
  3. Manually set mode to "Sampling Mode"
  4. Click Apply
  5. Click Run
  6. Verify sampled visualization

#### Scenario 5: Multiple Solutions
- **Input**: N = 4, Max Solutions = 2
- **Expected Behavior**:
  - Should find multiple solutions
  - Should show solution count
  - Should display each solution found
- **Steps to Test**:
  1. Navigate to N-Queens Problem page
  2. Enter N = 4
  3. Set Max Solutions = 2
  4. Click Apply
  5. Click Run
  6. Verify multiple solutions are found
  7. Verify solution counter updates

### Edge Cases
- **N=1**: Should handle single queen
- **N=2, N=3**: Should show no solution message
- **N > 20**: Should show error (safety cap)
- **Invalid Max Solutions**: Should validate range 1-100
- **Step Limit Reached**: Should handle gracefully for very large N

---

## Integration Tests

### Universal Execution Controller
- **Test**: Both algorithms should work with Run/Step/Pause/Reset/Speed controls
- **Steps**:
  1. Test Run button on both algorithms
  2. Test Step button (step through manually)
  3. Test Pause button during execution
  4. Test Reset button
  5. Test Speed slider (adjust speed)
  6. Verify progress bar updates
  7. Verify logs panel shows steps

### Code Panel
- **Test**: Code highlighting should work for both algorithms
- **Steps**:
  1. Verify code is displayed
  2. Verify line highlighting during execution
  3. Verify language switching works (JavaScript, Python, Pseudocode)

### Input Panels
- **Test**: Input panels should validate and apply correctly
- **Steps**:
  1. Test invalid inputs (should show errors)
  2. Test preset buttons
  3. Test Apply button
  4. Verify input changes trigger step regeneration

### Visualizers
- **Test**: Visualizers should update correctly during execution
- **Steps**:
  1. Verify DPVisualizer shows DP table for Fibonacci
  2. Verify GridVisualizer shows chessboard for N-Queens
  3. Verify visualizations update on each step
  4. Verify "No data to visualize" message when empty

---

## Performance Tests

### Fibonacci
- **n=50**: Should complete in < 1 second (full mode)
- **n=1000**: Should complete in < 5 seconds (condensed mode)
- **n=100000**: Should complete in < 30 seconds (computation-only)

### N-Queens
- **N=8**: Should complete in < 5 seconds (full mode)
- **N=12**: Should complete in < 30 seconds (sampling mode)
- **N=14**: Should complete in < 60 seconds (fast-solve mode)

---

## Browser Compatibility
- Test in Chrome, Firefox, Safari, Edge
- Verify BigInt support for large Fibonacci numbers
- Verify SVG rendering for N-Queens board

---

## Notes
- All tests should be performed with console open to check for errors
- Verify no "Code not available" placeholders appear
- Verify all UI elements are responsive and accessible


