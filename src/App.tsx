import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TowerOfHanoi from "./pages/algorithms/TowerOfHanoi";
import ClosestPair from "./pages/algorithms/ClosestPair";
import FractionalKnapsack from "./pages/algorithms/FractionalKnapsack";
import OptimalMerge from "./pages/algorithms/OptimalMerge";
import Knapsack01 from "./pages/algorithms/Knapsack01";
import LCS from "./pages/algorithms/LCS";
import BellmanFord from "./pages/algorithms/BellmanFord";
import Sudoku from "./pages/algorithms/Sudoku";
import RatInMaze from "./pages/algorithms/RatInMaze";
import KnightsTour from "./pages/algorithms/KnightsTour";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/algorithms/tower-of-hanoi" element={<TowerOfHanoi />} />
          <Route path="/algorithms/closest-pair" element={<ClosestPair />} />
          <Route path="/algorithms/fractional-knapsack" element={<FractionalKnapsack />} />
          <Route path="/algorithms/optimal-merge" element={<OptimalMerge />} />
          <Route path="/algorithms/knapsack-01" element={<Knapsack01 />} />
          <Route path="/algorithms/lcs" element={<LCS />} />
          <Route path="/algorithms/bellman-ford" element={<BellmanFord />} />
          <Route path="/algorithms/sudoku" element={<Sudoku />} />
          <Route path="/algorithms/rat-in-maze" element={<RatInMaze />} />
          <Route path="/algorithms/knights-tour" element={<KnightsTour />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
