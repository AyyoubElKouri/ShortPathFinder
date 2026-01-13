/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useCallback } from "react";
import { useGridStore } from "../stores/GridStore";
import { useConfigStore } from "../stores/ConfigStore";
import { useWebAssembly } from "./useWebAssembly";
import { useWasmGraphBuilder } from "./useWasmGraphBuilder";
import { useSoundEffect } from "./useSoundEffect";
import type {
	SearchEngine,
	SearchResults,
	AlgorithmType,
	HeuristicType,
} from "@/wasm/bin/searchengine";
import { Algorithm, Heuristic } from "../lib/enums";

interface PathfindingReturns {
	/**
	 * Starts the pathfinding process on the current grid
	 *
	 * @return Promise<void> - Resolves when pathfinding is complete
	 *
	 * @throws PathfindingError - When pathfinding fails due to invalid configuration or WebAssembly errors
	 */
	run: () => Promise<void>;

	/**
	 * Indicates whether the pathfinding process is currently running
	 */
	isRunning: boolean;

	/**
	 * Indicates whether all dependencies are ready for pathfinding
	 */
	isReady: boolean;
}

/**
 * @hook usePathfinding
 * @brief Coordinates the execution of pathfinding algorithms with visual and audio feedback
 * @description This hook orchestrates the entire pathfinding process by integrating WebAssembly
 *              algorithms with React state management. It converts grid data to WebAssembly
 *              graphs, executes the selected algorithm, updates the grid visualization, and
 *              provides sound effects for an interactive experience.
 *
 * @return PathfindingReturns - Object containing pathfinding execution function and status flags
 *
 * @dependencies
 *  - useGridStore: Provides grid state and cell manipulation functions
 *  - useConfigStore: Provides algorithm and heuristic configuration
 *  - useWebAssembly: Provides the WebAssembly module with SearchEngine
 *  - useWasmGraphBuilder: Converts grid to WebAssembly SearchGraph
 *  - useSoundEffect: Provides sound effects for algorithm visualization
 *
 * @example
 * ```tsx
 * const { run, isRunning, isReady } = usePathfinding();
 *
 * // Start pathfinding when user clicks a button
 * <button onClick={run} disabled={!isReady || isRunning}>
 *   Start Algorithm
 * </button>
 * ```
 *
 * @throws
 *  - PathfindingError - When WebAssembly module is not loaded or graph construction fails
 *  - GridValidationError - When start or end cells are missing (propagated from useGridStore)
 *
 */
export function usePathfinding(): PathfindingReturns {
	/** Import grid state and control functions */
	const {
		readyToRun,
		setIsRunning,
		cellules,
		rows,
		cols,
		isRunning: gridIsRunning,
	} = useGridStore();

	/** Import algorithm configuration */
	const {
		algorithm: configAlgorithm,
		heuristic: configHeuristic,
		allowDiagonal,
		bidirectional,
		dontCrossCorners,
	} = useConfigStore();

	/** Import WebAssembly module */
	const { module: wasmModule, isLoaded: isWasmLoaded } = useWebAssembly();

	/** Import graph builder */
	const { buildGraphFromGrid, isReady: isGraphBuilderReady } =
		useWasmGraphBuilder();

	/** Import sound effects */
	const { initializeAudio, playVisitedSound, playPathSound, playSuccessChord } =
		useSoundEffect();

	/** Configuration for batch processing animation */
	const BATCH_SIZE = 50;
	const VISITED_DELAY_MS = 50;
	const PATH_DELAY_MS = 200;

	/**
	 * Converts internal Algorithm enum to WebAssembly AlgorithmType
	 */
	const convertAlgorithmToWasmType = (algorithm: Algorithm): AlgorithmType => {
		if (!wasmModule) {
			throw new Error("PathfindingError: WebAssembly module not loaded");
		}

		switch (algorithm) {
			case Algorithm.BFS:
				return wasmModule.AlgorithmType.BFS;
			case Algorithm.DIJKSTRA:
				return wasmModule.AlgorithmType.DIJKSTRA;
			case Algorithm.ASTAR:
				return wasmModule.AlgorithmType.ASTAR;
			case Algorithm.IDASTAR:
				return wasmModule.AlgorithmType.IDASTAR;
			case Algorithm.DFS:
				return wasmModule.AlgorithmType.DFS;
			case Algorithm.JUMPPOINT:
				return wasmModule.AlgorithmType.JUMPPOINT;
			case Algorithm.ORTHOGONALJUMPPOINT:
				return wasmModule.AlgorithmType.ORTHOGONALJUMPPOINT;
			case Algorithm.TRACE:
				return wasmModule.AlgorithmType.TRACE;
			default:
				// Default to Dijkstra for unknown algorithms
				return wasmModule.AlgorithmType.DIJKSTRA;
		}
	};

	/**
	 * Converts internal Heuristic enum to WebAssembly HeuristicType
	 */
	const convertHeuristicToWasmType = (heuristic: Heuristic): HeuristicType => {
		if (!wasmModule) {
			throw new Error("PathfindingError: WebAssembly module not loaded");
		}

		switch (heuristic) {
			case Heuristic.MANHATTAN:
				return wasmModule.HeuristicType.MANHATTAN;
			case Heuristic.EUCLIDEAN:
				return wasmModule.HeuristicType.EUCLIDEAN;
			case Heuristic.OCTILE:
				return wasmModule.HeuristicType.OCTILE;
			case Heuristic.CHEBYSHEV:
				return wasmModule.HeuristicType.CHEBYSHEV;
			default:
				// Default to Manhattan for unknown heuristics
				return wasmModule.HeuristicType.MANHATTAN;
		}
	};

	/**
	 * Finds start and end nodes in the grid and maps them to node IDs
	 */
	const findStartAndEndNodeIds = (): {
		startNodeId: number;
		endNodeId: number;
	} => {
		let startNodeId = -1;
		let endNodeId = -1;

		// Search through grid to find start and end positions
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const cell = cellules[y][x];
				if (cell.state === "start") {
					startNodeId = y * cols + x;
				} else if (cell.state === "end") {
					endNodeId = y * cols + x;
				}

				// Early exit if both found
				if (startNodeId !== -1 && endNodeId !== -1) {
					break;
				}
			}
			if (startNodeId !== -1 && endNodeId !== -1) {
				break;
			}
		}

		if (startNodeId === -1 || endNodeId === -1) {
			throw new Error("PathfindingError: Start or end cell not found in grid");
		}

		return { startNodeId, endNodeId };
	};

	/**
	 * Creates and configures the WebAssembly SearchEngine
	 */
	const createSearchEngine = (
		graph: any,
		startNodeId: number,
		endNodeId: number,
	): SearchEngine => {
		if (!wasmModule) {
			throw new Error("PathfindingError: WebAssembly module not loaded");
		}

		const wasmAlgorithm = convertAlgorithmToWasmType(configAlgorithm);
		const requiresHeuristic =
			configAlgorithm === Algorithm.ASTAR ||
			configAlgorithm === Algorithm.IDASTAR;

		if (requiresHeuristic) {
			const wasmHeuristic = convertHeuristicToWasmType(configHeuristic);
			return new wasmModule.SearchEngine(
				wasmAlgorithm,
				wasmHeuristic,
				graph,
				startNodeId,
				endNodeId,
				allowDiagonal,
				bidirectional,
				dontCrossCorners,
			);
		} else {
			return new wasmModule.SearchEngine(
				wasmAlgorithm,
				graph,
				startNodeId,
				endNodeId,
				allowDiagonal,
				bidirectional,
				dontCrossCorners,
			);
		}
	};

	/**
	 * Updates grid cells in batches for smooth animation
	 */
	const updateGridCellsInBatches = async (
		nodeIds: number[],
		state: "visited" | "path",
		soundCallback: (index: number) => void,
	): Promise<void> => {
		for (let i = 0; i < nodeIds.length; i += BATCH_SIZE) {
			const batch = nodeIds.slice(i, i + BATCH_SIZE);

			// Update grid state for this batch
			useGridStore.setState((gridState) => {
				const newGrid = gridState.cellules.map((row) =>
					row.map((cell) => ({ ...cell })),
				);

				batch.forEach((nodeId) => {
					const x = nodeId % cols;
					const y = Math.floor(nodeId / cols);

					// Check bounds and preserve special cells
					if (y < rows && x < cols) {
						const currentState = newGrid[y][x].state;
						if (currentState !== "start" && currentState !== "end") {
							newGrid[y][x].state = state;
						}
					}
				});

				return { cellules: newGrid };
			});

			// Play sound for this batch
			soundCallback(i);

			// Delay between batches for animation effect
			await new Promise((resolve) => setTimeout(resolve, VISITED_DELAY_MS));
		}
	};

	/**
	 * Processes WebAssembly SearchResults and updates visualization
	 */
	const processSearchResults = async (
		results: SearchResults,
	): Promise<void> => {
		if (!results.success) {
			console.warn("Algorithm did not find a path", results);
			return;
		}

		// Extract visited nodes from WebAssembly vector
		const visitedNodes: number[] = [];
		const visitedCount = results.visited.size();
		for (let i = 0; i < visitedCount; i++) {
			const nodeId = results.visited.get(i);
			if (nodeId !== undefined) {
				visitedNodes.push(nodeId);
			}
		}

		// Extract path nodes from WebAssembly vector
		const pathNodes: number[] = [];
		const pathCount = results.path.size();
		for (let i = 0; i < pathCount; i++) {
			const nodeId = results.path.get(i);
			if (nodeId !== undefined) {
				pathNodes.push(nodeId);
			}
		}

		// Animate visited nodes
		if (visitedNodes.length > 0) {
			await updateGridCellsInBatches(visitedNodes, "visited", playVisitedSound);
		}

		// Pause before showing path
		await new Promise((resolve) => setTimeout(resolve, PATH_DELAY_MS));

		// Animate path nodes
		if (pathNodes.length > 0) {
			await updateGridCellsInBatches(pathNodes, "path", playPathSound);
			await playSuccessChord();
		}

		// Log algorithm performance
		console.log(
			`Algorithm completed: ${results.success ? "Success" : "No path found"}`,
		);
		console.log(`Cost: ${results.cost}, Time: ${results.time}ms`);
		console.log(
			`Visited nodes: ${visitedNodes.length}, Path length: ${pathNodes.length}`,
		);
	};

	/**
	 * Main pathfinding execution function
	 */
	const runPathfinding = useCallback(async (): Promise<void> => {
		try {
			// Validate grid and clear previous results
			readyToRun();

			// Set running state
			setIsRunning(true);

			// Initialize audio for sound effects
			await initializeAudio();

			// Build WebAssembly graph from current grid
			const graph = buildGraphFromGrid();

			// Find start and end node IDs
			const { startNodeId, endNodeId } = findStartAndEndNodeIds();

			// Create and configure search engine
			const searchEngine = createSearchEngine(graph, startNodeId, endNodeId);

			// Execute algorithm
			const results = searchEngine.runSearch();

			// Process results and update visualization
			await processSearchResults(results);
		} catch (error) {
			// Handle errors gracefully
			console.error("Pathfinding execution failed:", error);

			if (error instanceof Error) {
				throw new Error(`PathfindingError: ${error.message}`);
			}

			throw new Error(
				"PathfindingError: Unknown error during pathfinding execution",
			);
		} finally {
			// Always reset running state
			setIsRunning(false);
		}
	}, [
		readyToRun,
		setIsRunning,
		initializeAudio,
		buildGraphFromGrid,
		cellules,
		rows,
		cols,
		configAlgorithm,
		configHeuristic,
		allowDiagonal,
		bidirectional,
		dontCrossCorners,
		wasmModule,
		playVisitedSound,
		playPathSound,
		playSuccessChord,
	]);

	/** Calculate overall readiness status */
	const isReady = isWasmLoaded && isGraphBuilderReady && !gridIsRunning;

	return {
		run: runPathfinding,
		isRunning: gridIsRunning,
		isReady,
	};
}
