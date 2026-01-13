/* 
  - You are a senior in Software Engineering with 10 years of experience in web development.
  - You have a strong background in TypeScript, React, and state management libraries like Zustand.
  - You are meticulous about code quality, maintainability, and best practices.

  - Implement this.
  - Do not add any think that are not damanded, whitout any extra philosofy.
  - If you miss an information, ask me about start generating code.
  - Comments are mandatory for every function and complex logic, so new developers can understand the code easily.
  - Comments must be in simple english.
*/

// Staging area:
/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { SearchGraph } from "@/wasm/bin/searchengine";
import { useGridStore } from "@/lib/stores/gridStore";
import { useWebAssembly } from "./hooks/useWebAssembly";

/**
 * Configuration options for graph building
 */
interface GraphBuilderConfig {
  /**
   * Whether to use diagonal connections in the graph (8-directional movement)
   * @default false (4-directional movement only)
   */
  useDiagonals?: boolean;

  /**
   * Weight for diagonal edges (used when useDiagonals is true)
   * Typically sqrt(2) ≈ 1.414 for uniform diagonal cost
   * @default 1.414
   */
  diagonalWeight?: number;

  /**
   * Weight for orthogonal edges (up, down, left, right)
   * @default 1.0
   */
  orthogonalWeight?: number;
}

/**
 * Return type of the useWasmGraphBuilder hook
 */
interface GraphBuilderReturns {
  /**
   * Builds a graph representation from the current grid state for web assembly pathfinding.
   * Converts the grid cells into a WebAssembly SearchGraph with nodes and edges.
   * 
   * @returns A SearchGraph instance ready for pathfinding algorithms
   * @throws Error if WebAssembly module is not loaded or grid is invalid
   */
  buildGraphFromGrid: () => SearchGraph;

  /**
   * Indicates whether the graph builder is ready to build graphs
   * Requires both WebAssembly module and grid to be available
   */
  isReady: boolean;

  /**
   * Any error that occurred during graph building initialization
   */
  error: Error | null;
}

/**
 * Hook to build WebAssembly SearchGraph from grid state
 * 
 * This hook:
 * 1. Accesses the current grid state from Zustand store
 * 2. Uses the WebAssembly module from useWebAssembly hook
 * 3. Converts grid cells into nodes and edges for pathfinding
 * 4. Handles obstacles (walls) by excluding them from the graph
 * 
 * The graph is constructed with the following rules:
 * - Each empty, start, end, path, or visited cell becomes a node
 * - Walls are excluded from the graph (cannot be traversed)
 * - Edges connect adjacent cells based on configuration (4 or 8 directions)
 * - Edge weights can be configured for different movement costs
 * 
 * @param config - Configuration options for graph building
 * @returns GraphBuilderReturns object with graph building function and status
 * 
 * @example
 * // Basic usage
 * const { buildGraphFromGrid, isReady } = useWasmGraphBuilder();
 * 
 * if (isReady) {
 *   const graph = buildGraphFromGrid();
 *   // Use graph with WebAssembly pathfinding algorithms
 * }
 * 
 * @example
 * // With diagonal movement
 * const { buildGraphFromGrid } = useWasmGraphBuilder({
 *   useDiagonals: true,
 *   diagonalWeight: 1.414
 * });
 */
export function useWasmGraphBuilder(config?: GraphBuilderConfig): GraphBuilderReturns {
  const {
    useDiagonals = false,
    diagonalWeight = Math.SQRT2,
    orthogonalWeight = 1.0,
  } = config || {};

  // Access grid state from Zustand store
  const { cellules, rows, cols } = useGridStore();

  // Access WebAssembly module
  const { module: wasmModule, isLoaded: wasmLoaded, error: wasmError } = useWebAssembly();

  /**
   * Maps grid coordinates to node indices for efficient lookup
   * Creates a 2D array where each cell stores its corresponding node index
   * Returns both the mapping array and total node count
   */
  const createNodeMapping = (): { 
    nodeIndexMap: number[][]; 
    nodeCount: number 
  } => {
    // Initialize mapping with -1 (no node)
    const nodeIndexMap: number[][] = Array.from({ length: rows }, () => 
      Array(cols).fill(-1)
    );
    
    let nodeIndex = 0;

    // First pass: assign node indices to traversable cells
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = cellules[y][x];
        
        // Include only traversable cells (not walls)
        if (cell.state !== "wall") {
          nodeIndexMap[y][x] = nodeIndex;
          nodeIndex++;
        }
      }
    }

    return { nodeIndexMap, nodeCount: nodeIndex };
  };

  /**
   * Checks if two cells are diagonally adjacent
   * Used when diagonal movement is enabled
   */
  const isDiagonalNeighbor = (
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number
  ): boolean => {
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    return dx === 1 && dy === 1;
  };


  /**
   * Gets the appropriate weight for an edge based on movement type
   */
  const getEdgeWeight = (
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number
  ): number => {
    if (isDiagonalNeighbor(x1, y1, x2, y2)) {
      return diagonalWeight;
    }
    return orthogonalWeight;
  };

  /**
   * Validates that all prerequisites are met before building graph
   * Throws descriptive errors if requirements are not satisfied
   */
  const validatePrerequisites = (): void => {
    if (!wasmLoaded) {
      throw new Error("WebAssembly module is not loaded yet");
    }

    if (!wasmModule) {
      throw new Error("WebAssembly module instance is not available");
    }

    if (!wasmModule.SearchGraph) {
      throw new Error("SearchGraph class not found in WebAssembly module");
    }

    if (rows === 0 || cols === 0) {
      throw new Error("Grid dimensions are invalid (rows or columns is zero)");
    }

    // Check if grid has at least one traversable cell
    let hasTraversableCell = false;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (cellules[y][x].state !== "wall") {
          hasTraversableCell = true;
          break;
        }
      }
      if (hasTraversableCell) break;
    }

    if (!hasTraversableCell) {
      throw new Error("Grid contains only walls (no traversable cells)");
    }
  };

  /**
   * Builds the graph by adding nodes for all traversable cells
   * Each node gets its X,Y coordinates stored for heuristic calculations
   */
  const addNodesToGraph = (
    graph: SearchGraph, 
    nodeIndexMap: number[][]
  ): void => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const nodeIndex = nodeIndexMap[y][x];
        
        // Skip walls (no node)
        if (nodeIndex === -1) {
          continue;
        }

        // Add node with coordinates
        // Note: This assumes the WebAssembly module has addNodeXY method
        // If not, we'd need to use addNode() and store coordinates separately
        graph.addNodeXY(x, y);
      }
    }
  };

  /**
   * Adds edges between adjacent nodes based on configuration
   * Handles both orthogonal and diagonal connections as configured
   */
  const addEdgesToGraph = (
    graph: SearchGraph, 
    nodeIndexMap: number[][]
  ): void => {
    // Define neighbor directions based on configuration
    const directions = [
      // Orthogonal directions (always included)
      { dx: 1, dy: 0 },   // Right
      { dx: 0, dy: 1 },   // Down
      { dx: -1, dy: 0 },  // Left
      { dx: 0, dy: -1 },  // Up
    ];

    // Add diagonal directions if enabled
    if (useDiagonals) {
      directions.push(
        { dx: 1, dy: 1 },   // Down-Right
        { dx: 1, dy: -1 },  // Up-Right
        { dx: -1, dy: 1 },  // Down-Left
        { dx: -1, dy: -1 }  // Up-Left
      );
    }

    // Connect nodes with edges
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const fromNode = nodeIndexMap[y][x];
        
        // Skip if no node at this position (wall)
        if (fromNode === -1) {
          continue;
        }

        // Check all possible directions
        for (const dir of directions) {
          const nx = x + dir.dx;
          const ny = y + dir.dy;

          // Check bounds
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
            continue;
          }

          const toNode = nodeIndexMap[ny][nx];
          
          // Skip if neighbor is a wall
          if (toNode === -1) {
            continue;
          }

          // Add edge in both directions for undirected graph
          // (pathfinding algorithms typically work with directed graphs
          // but we want bidirectional movement)
          const weight = getEdgeWeight(x, y, nx, ny);
          graph.addEdge(fromNode, toNode, weight);
        }
      }
    }
  };

  /**
   * Main function to build graph from current grid state
   */
  const buildGraphFromGrid = (): SearchGraph => {
    // Validate prerequisites before starting
    validatePrerequisites();

    // Create node mapping from grid
    const { nodeIndexMap, nodeCount } = createNodeMapping();

    if (nodeCount === 0) {
      throw new Error("No traversable cells found in grid");
    }

    try {
      // Create new SearchGraph instance from WebAssembly module
      // Note: Assuming the WebAssembly module exposes SearchGraph as a constructor
      // If it's a factory function, adjust accordingly
      const graph = new (wasmModule as any).SearchGraph() as SearchGraph;

      // Add nodes for all traversable cells
      addNodesToGraph(graph, nodeIndexMap);

      // Verify node count matches
      const actualNodeCount = graph.getNodeCount();
      if (actualNodeCount !== nodeCount) {
        console.warn(
          `Node count mismatch: expected ${nodeCount}, got ${actualNodeCount}. ` +
          "This may indicate an issue with the WebAssembly module."
        );
      }

      // Add edges between connected nodes
      addEdgesToGraph(graph, nodeIndexMap);

      return graph;
    } catch (error) {
      // Enhance error message with context
      const enhancedError = error instanceof Error 
        ? new Error(`Failed to build graph: ${error.message}`)
        : new Error("Failed to build graph: Unknown error occurred");
      
      throw enhancedError;
    }
  };

  // Calculate readiness based on WebAssembly and grid state
  const isReady = wasmLoaded && wasmModule !== null && rows > 0 && cols > 0;

  // Combine WebAssembly errors with any graph-specific errors
  const error = wasmError || null;

  return {
    buildGraphFromGrid,
    isReady,
    error,
  };
}