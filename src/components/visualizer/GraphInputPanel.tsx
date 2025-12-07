import { useState, useMemo, useCallback, useEffect } from 'react';
import { Shuffle, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { GraphInput } from '@/algorithms/runners/graph';
import { GraphVisualizer } from './GraphVisualizer';
import { VisualizationStep } from '@/types/algorithm';

interface GraphInputPanelProps {
  onInputChange: (input: Record<string, unknown>) => void;
  className?: string;
  currentInput?: GraphInput;
}

export function GraphInputPanel({ onInputChange, className, currentInput }: GraphInputPanelProps) {
  const [nodes, setNodes] = useState<number[]>(() => currentInput?.nodes || []);
  const [edges, setEdges] = useState<[number, number][]>(() => currentInput?.edges || []);
  const [startNode, setStartNode] = useState<number>(() => currentInput?.startNode ?? 0);
  const [newNodeId, setNewNodeId] = useState<string>('');
  const [edgeFrom, setEdgeFrom] = useState<string>('');
  const [edgeTo, setEdgeTo] = useState<string>('');
  const [numNodes, setNumNodes] = useState<string>('6');
  const [maxEdges, setMaxEdges] = useState<string>('10');
  const [error, setError] = useState('');

  // Update local state when currentInput changes (but only if it's different to avoid loops)
  useEffect(() => {
    if (currentInput) {
      const nodesChanged = JSON.stringify(currentInput.nodes) !== JSON.stringify(nodes);
      const edgesChanged = JSON.stringify(currentInput.edges) !== JSON.stringify(edges);
      const startNodeChanged = currentInput.startNode !== startNode;
      
      if (nodesChanged || edgesChanged || startNodeChanged) {
        setNodes(currentInput.nodes || []);
        setEdges(currentInput.edges || []);
        setStartNode(currentInput.startNode ?? 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInput]);

  // Create a preview step for visualization
  const previewStep: VisualizationStep | null = useMemo(() => {
    if (nodes.length === 0) return null;
    
    return {
      kind: 'init',
      payload: { nodes, edges, startNode },
      codeLine: 0,
      description: 'Graph preview',
    };
  }, [nodes, edges, startNode]);

  const addNode = useCallback(() => {
    const nodeId = parseInt(newNodeId.trim(), 10);
    if (isNaN(nodeId)) {
      setError('Please enter a valid node number');
      return;
    }
    if (nodes.includes(nodeId)) {
      setError(`Node ${nodeId} already exists`);
      return;
    }
    
    setError('');
    const newNodes = [...nodes, nodeId].sort((a, b) => a - b);
    setNodes(newNodes);
    setNewNodeId('');
    
    // Update start node if it's the first node
    if (newNodes.length === 1) {
      setStartNode(nodeId);
    }
    
    // Trigger input change
    onInputChange({ nodes: newNodes, edges, startNode: newNodes.length === 1 ? nodeId : startNode });
  }, [nodes, edges, startNode, newNodeId, onInputChange]);

  const removeNode = useCallback((nodeId: number) => {
    const newNodes = nodes.filter(n => n !== nodeId);
    const newEdges = edges.filter(([a, b]) => a !== nodeId && b !== nodeId);
    const newStartNode = startNode === nodeId && newNodes.length > 0 ? newNodes[0] : startNode;
    
    setNodes(newNodes);
    setEdges(newEdges);
    setStartNode(newStartNode);
    setError('');
    
    onInputChange({ nodes: newNodes, edges: newEdges, startNode: newStartNode });
  }, [nodes, edges, startNode, onInputChange]);

  const addEdge = useCallback(() => {
    const from = parseInt(edgeFrom.trim(), 10);
    const to = parseInt(edgeTo.trim(), 10);
    
    if (isNaN(from) || isNaN(to)) {
      setError('Please enter valid node numbers');
      return;
    }
    if (from === to) {
      setError('A node cannot connect to itself');
      return;
    }
    if (!nodes.includes(from) || !nodes.includes(to)) {
      setError('Both nodes must exist in the graph');
      return;
    }
    
    // Check if edge already exists
    const edgeExists = edges.some(([a, b]) => 
      (a === from && b === to) || (a === to && b === from)
    );
    
    if (edgeExists) {
      setError('Edge already exists');
      return;
    }
    
    setError('');
    const newEdges: [number, number][] = [...edges, [from, to]];
    setEdges(newEdges);
    setEdgeFrom('');
    setEdgeTo('');
    
    onInputChange({ nodes, edges: newEdges, startNode });
  }, [nodes, edges, startNode, edgeFrom, edgeTo, onInputChange]);

  const removeEdge = useCallback((edge: [number, number]) => {
    const newEdges = edges.filter(([a, b]) => 
      !(a === edge[0] && b === edge[1]) && !(a === edge[1] && b === edge[0])
    );
    setEdges(newEdges);
    onInputChange({ nodes, edges: newEdges, startNode });
  }, [nodes, edges, startNode, onInputChange]);

  const generateRandomGraph = useCallback(() => {
    const numNodesInt = parseInt(numNodes.trim(), 10);
    const maxEdgesInt = parseInt(maxEdges.trim(), 10);
    
    if (isNaN(numNodesInt) || numNodesInt < 1 || numNodesInt > 20) {
      setError('Number of nodes must be between 1 and 20');
      return;
    }
    if (isNaN(maxEdgesInt) || maxEdgesInt < 0) {
      setError('Max edges must be a positive number');
      return;
    }
    
    setError('');
    
    // Generate nodes (0 to numNodesInt-1)
    const newNodes = Array.from({ length: numNodesInt }, (_, i) => i);
    setNodes(newNodes);
    
    // Generate edges randomly
    const newEdges: [number, number][] = [];
    const possibleEdges: [number, number][] = [];
    
    // Generate all possible edges
    for (let i = 0; i < numNodesInt; i++) {
      for (let j = i + 1; j < numNodesInt; j++) {
        possibleEdges.push([i, j]);
      }
    }
    
    // Shuffle and take up to maxEdgesInt
    const shuffled = [...possibleEdges].sort(() => Math.random() - 0.5);
    const numEdgesToAdd = Math.min(maxEdgesInt, shuffled.length);
    
    for (let i = 0; i < numEdgesToAdd; i++) {
      newEdges.push(shuffled[i]);
    }
    
    setEdges(newEdges);
    setStartNode(0);
    
    onInputChange({ nodes: newNodes, edges: newEdges, startNode: 0 });
  }, [numNodes, maxEdges, onInputChange]);

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setStartNode(0);
    setError('');
    onInputChange({ nodes: [], edges: [], startNode: 0 });
  }, [onInputChange]);

  return (
    <div className={cn('glass-panel p-4 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Graph Configuration</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={clearGraph}
          className="h-8 gap-1.5 text-xs border-panel-border hover:border-destructive hover:text-destructive"
        >
          <Minus className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>

      {/* Random Graph Generator */}
      <div className="space-y-3 border-b border-panel-border pb-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Random Graph Generator</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRandomGraph}
            className="h-8 gap-1.5 text-xs border-panel-border hover:border-secondary hover:text-secondary"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Generate Random Graph
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="num-nodes" className="text-xs text-muted-foreground">
              Number of Nodes
            </Label>
            <Input
              id="num-nodes"
              type="number"
              min="1"
              max="20"
              value={numNodes}
              onChange={(e) => setNumNodes(e.target.value)}
              placeholder="6"
              className="font-mono text-sm bg-muted/50 border-panel-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="max-edges" className="text-xs text-muted-foreground">
              Max Edges
            </Label>
            <Input
              id="max-edges"
              type="number"
              min="0"
              value={maxEdges}
              onChange={(e) => setMaxEdges(e.target.value)}
              placeholder="10"
              className="font-mono text-sm bg-muted/50 border-panel-border"
            />
          </div>
        </div>
      </div>

      {/* Manual Graph Builder */}
      <div className="space-y-3 border-b border-panel-border pb-4">
        <Label className="text-xs text-muted-foreground">Manual Graph Builder</Label>
        
        {/* Add Node */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              value={newNodeId}
              onChange={(e) => setNewNodeId(e.target.value)}
              placeholder="Node ID"
              className="font-mono text-sm bg-muted/50 border-panel-border flex-1"
            />
            <Button
              onClick={addNode}
              size="sm"
              className="h-9 gap-1.5 bg-primary/80 hover:bg-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Node
            </Button>
          </div>
        </div>

        {/* Add Edge */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              value={edgeFrom}
              onChange={(e) => setEdgeFrom(e.target.value)}
              placeholder="From"
              className="font-mono text-sm bg-muted/50 border-panel-border flex-1"
            />
            <Input
              type="number"
              value={edgeTo}
              onChange={(e) => setEdgeTo(e.target.value)}
              placeholder="To"
              className="font-mono text-sm bg-muted/50 border-panel-border flex-1"
            />
            <Button
              onClick={addEdge}
              size="sm"
              className="h-9 gap-1.5 bg-primary/80 hover:bg-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Edge
            </Button>
          </div>
        </div>

        {/* Start Node Selector */}
        {nodes.length > 0 && (
          <div className="space-y-1.5">
            <Label htmlFor="start-node" className="text-xs text-muted-foreground">
              Start Node
            </Label>
            <Select
              value={startNode.toString()}
              onValueChange={(value) => {
                const newStartNode = parseInt(value, 10);
                setStartNode(newStartNode);
                onInputChange({ nodes, edges, startNode: newStartNode });
              }}
            >
              <SelectTrigger id="start-node" className="font-mono text-sm bg-muted/50 border-panel-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node} value={node.toString()}>
                    {node}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Graph Info */}
      {nodes.length > 0 && (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nodes:</span>
            <span className="font-mono font-medium text-foreground">{nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Edges:</span>
            <span className="font-mono font-medium text-foreground">{edges.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Node:</span>
            <span className="font-mono font-medium text-foreground">{startNode}</span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Graph Preview */}
      <div className="border-t border-panel-border pt-4">
        <Label className="text-xs text-muted-foreground mb-2 block">Graph Preview</Label>
        <div className="h-[250px]">
          {nodes.length === 0 ? (
            <div className="h-full flex items-center justify-center border border-panel-border rounded-md bg-muted/20">
            <p className="text-sm text-muted-foreground">No graph to visualize</p>
          </div>
          ) : (
            <GraphVisualizer currentStep={previewStep} className="h-full" />
          )}
        </div>
      </div>
    </div>
  );
}

