/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import type { SearchGraph } from "@/wasm/bin/searchengine";

import { useGridStore } from "../stores/GridStore";
import { useWebAssembly } from "./useWebAssembly";

interface GraphBuilderReturns {
	/**
	 * Builds a WebAssembly SearchGraph from the current grid state
	 *
	 * @return SearchGraph - WebAssembly graph object ready for pathfinding algorithms
	 *
	 * @throws GraphConstructionError - When WebAssembly module is not loaded
	 */
	buildGraphFromGrid: () => SearchGraph;

	/**
	 * Checks if the graph builder is ready to construct graphs
	 */
	isReady: boolean;
}

/**
 * @hook useWasmGraphBuilder
 * @brief Converts grid state to WebAssembly graph representation
 * @description This hook transforms the 2D grid state from useGridStore into a WebAssembly
 *              SearchGraph object that can be consumed by pathfinding algorithms.
 *              It handles node creation, edge generation, and coordinate mapping between
 *              the visual grid and the underlying graph structure.
 *
 * @return GraphBuilderReturns - Object containing graph building function and readiness state
 * 
 * @dependencies 
 *  - useWebAssembly: Provides the WebAssembly module with SearchGraph constructor
 *  - useGridStore: Provides the grid state to convert into a graph
 * 
 * @example
 * ```tsx
 * const { buildGraphFromGrid, isReady } = useWasmGraphBuilder();
 * 
 * // When ready to run pathfinding
 * if (isReady) {
 *   const graph = buildGraphFromGrid();
 *   // Pass graph to pathfinding algorithm
 * }
 * ```
 * 
 * @throws
 *  - GraphConstructionError - When buildGraphFromGrid is called before WebAssembly is loaded
 * 
 */
export function useWasmGraphBuilder(): GraphBuilderReturns {
	const { module: wasmModule, isLoaded: isWasmLoaded } = useWebAssembly();
	const { cellules: grid, rows, cols } = useGridStore();

	/** 
	 * Creates a SearchGraph instance using the WebAssembly module
	 */
	const createWasmGraph = (): SearchGraph => {
		if (!wasmModule) {
			throw new Error("GraphConstructionError: WebAssembly module is not loaded");
		}

		// Create undirected graph for grid-based pathfinding
		return new wasmModule.SearchGraph(false);
	};

	/** 
	 * Maps grid cell coordinates to graph node ID
	 */
	const getNodeIdFromCoordinates = (x: number, y: number): number => {
		return y * cols + x;
	};

	/** 
	 * Checks if a cell is traversable (not a wall)
	 */
	const isTraversableCell = (x: number, y: number): boolean => {
		if (y < 0 || y >= rows || x < 0 || x >= cols) return false;
		return grid[y][x].state !== "wall";
	};

	/** 
	 * Adds all traversable cells as nodes in the graph
	 */
	const addNodesToGraph = (graph: SearchGraph): void => {
		// Iterate through all grid positions
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				// Only add nodes for traversable cells
				if (isTraversableCell(x, y)) {
					// Use cell center coordinates for heuristic calculations
					graph.addNodeXY(x + 0.5, y + 0.5);
				} else {
					// Add placeholder node that will have no edges
					graph.addNodeXY(x + 0.5, y + 0.5);
				}
			}
		}
	};

	/** 
	 * Adds edges between adjacent traversable cells
	 */
	const addEdgesToGraph = (graph: SearchGraph): void => {
		// Define 4-direction movement (up, right, down, left)
		const directions = [
			{ dx: 0, dy: -1, weight: 1 },  // Up
			{ dx: 1, dy: 0, weight: 1 },   // Right
			{ dx: 0, dy: 1, weight: 1 },   // Down
			{ dx: -1, dy: 0, weight: 1 },  // Left
		];

		// Iterate through all traversable cells to add connections
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				// Skip wall cells (they won't have outgoing edges)
				if (!isTraversableCell(x, y)) continue;

				const sourceNodeId = getNodeIdFromCoordinates(x, y);

				// Check all four directions for valid connections
				for (const direction of directions) {
					const targetX = x + direction.dx;
					const targetY = y + direction.dy;

					// Check if target cell is within bounds and traversable
					if (isTraversableCell(targetX, targetY)) {
						const targetNodeId = getNodeIdFromCoordinates(targetX, targetY);
						
						// Add edge with movement cost of 1
						graph.addEdge(sourceNodeId, targetNodeId, direction.weight);
					}
				}
			}
		}
	};

	/** 
	 * Validates that the graph was constructed correctly
	 */
	const validateGraph = (graph: SearchGraph): void => {
		const nodeCount = graph.getNodeCount();
		const expectedCount = rows * cols;

		if (nodeCount !== expectedCount) {
			console.warn(
				`GraphConstruction: Expected ${expectedCount} nodes, got ${nodeCount}`
			);
		}
	};

	/** 
	 * Main function to build graph from current grid state
	 */
	const buildGraphFromGrid = (): SearchGraph => {
		try {
			// Create new WebAssembly graph instance
			const graph = createWasmGraph();

			// Add all grid positions as nodes
			addNodesToGraph(graph);

			// Connect adjacent traversable cells with edges
			addEdgesToGraph(graph);

			// Perform validation checks
			validateGraph(graph);

			return graph;
		} catch (error) {
			// Log detailed error information for debugging
			console.error("Graph construction failed:", error);
			
			if (error instanceof Error) {
				throw new Error(`GraphConstructionError: ${error.message}`);
			}
			
			throw new Error("GraphConstructionError: Unknown error during graph construction");
		}
	};

	// Calculate readiness based on WebAssembly loading state
	const isReady = isWasmLoaded && wasmModule !== null;

	return {
		buildGraphFromGrid,
		isReady,
	};
}